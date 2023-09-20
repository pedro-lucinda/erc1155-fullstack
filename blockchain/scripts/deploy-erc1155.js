const hre = require("hardhat");

async function main() {
  const token = await hre.ethers.deployContract("ERC1155Token", [
    "ipfs://QmcwCRCzVsrdhAT1qe462ioHuvYg4rpyFZ7VHGGxgcVmTB/{id}",
  ]);

  await token.waitForDeployment();

  console.log(`token deployed to ${token.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
