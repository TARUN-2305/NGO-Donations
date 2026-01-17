async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying DonationRegistry with:", deployer.address);

  const DonationRegistry =
    await ethers.getContractFactory("DonationRegistry");

  const registry = await DonationRegistry.deploy();
  await registry.waitForDeployment();

  console.log(
    "DonationRegistry deployed at:",
    await registry.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});