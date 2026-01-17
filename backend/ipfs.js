import pinataSDK from "@pinata/sdk";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_JWT
});

export async function uploadEncryptedBundle(bundle) {
  // Encrypt bundle
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encryptedBuffer = Buffer.concat([
    cipher.update(JSON.stringify(bundle)),
    cipher.final()
  ]);

  // Encode encrypted data as base64
  const encryptedPayload = encryptedBuffer.toString("base64");

  // Pin JSON to IPFS
  const result = await pinata.pinJSONToIPFS(
    {
      encrypted: encryptedPayload,
      encoding: "base64",
      algorithm: "aes-256-cbc"
    },
    {
      pinataMetadata: {
        name: `invoice-${Date.now()}`
      }
    }
  );

  return {
    cid: result.IpfsHash,
    encryption: {
      algorithm: "aes-256-cbc",
      key: key.toString("hex"),
      iv: iv.toString("hex")
    }
  };
}

export async function uploadFile(filePath) {
  const fs = await import("fs");
  const stream = fs.createReadStream(filePath);

  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: {
      name: `raw-invoice-${Date.now()}`
    }
  });

  return result.IpfsHash;
}
