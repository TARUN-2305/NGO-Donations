import { ethers } from "ethers";
import { connectWallet } from "../wallet";

const DONATION_REGISTRY_ADDRESS = "0x53e6cC3931521D18A1220355B965a4e164e79957";
const DONATION_REGISTRY_ABI = [
  "function recordDonation(bytes32,uint256,string) payable"
];

export default function Donate() {
  async function donate() {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      DONATION_REGISTRY_ADDRESS,
      DONATION_REGISTRY_ABI,
      signer
    );

    const commitment = ethers.keccak256(
      ethers.toUtf8Bytes(Date.now().toString())
    );

    await contract.recordDonation(
      commitment,
      1,
      "PENDING_CID",
      { value: ethers.parseEther("0.01") }
    );

    alert("Donation sent");
  }

  return (
    <div>
      <h3>Donor Dashboard</h3>
      <button onClick={donate}>Donate 0.01 ETH</button>
    </div>
  );
}
