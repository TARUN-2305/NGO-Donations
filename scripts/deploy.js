async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Lock = await ethers.getContractFactory("Lock");
  const unlockTime = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
  const lock = await Lock.deploy(unlockTime, { value: ethers.parseEther("0.001") });

  // In ethers v6, wait for deployment like this:
  await lock.waitForDeployment();

  console.log("Lock deployed to:", await lock.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
