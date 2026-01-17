async function main() {
  const Factory = await ethers.getContractFactory("Treasury");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  console.log("Treasury:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
