async function main() {
  const Factory = await ethers.getContractFactory("CauseManager");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  console.log("CauseManager:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
