async function main() {
  const Factory = await ethers.getContractFactory("InvoiceVerifier");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  console.log("InvoiceVerifier:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
