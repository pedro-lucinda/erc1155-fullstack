require("ethers");

async function main() {
  const ForgeContract = await ethers.deployContract("ForgingContract", [
    "0x2cC40bdaAB2bEEE96ef7c511f5172fe9fc7c73F1",
  ]);

  await ForgeContract.waitForDeployment();

  console.log(`deployed to ${ForgeContract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
