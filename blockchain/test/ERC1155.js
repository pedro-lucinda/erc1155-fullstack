const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("ERC1155", function () {
  async function deployERC1155Fixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ERC1155 = await ethers.getContractFactory("ERC1155Token");
    const erc1155 = await ERC1155.deploy("url");

    return { erc1155, owner, otherAccount };
  }

  it("Should set the right owner", async function () {
    const { erc1155, owner } = await loadFixture(deployERC1155Fixture); // Destructure owner

    expect(await erc1155.owner()).to.equal(owner.address);
  });

  it("Should mint an NFT", async function () {
    const { erc1155, owner } = await loadFixture(deployERC1155Fixture); // Destructure owner

    await erc1155.mint(owner.address, 1, 1, "0x00000000");
    expect(await erc1155.balanceOf(owner.address, 1)).to.equal(1);
  });

  it("should burn an NFT", async function () {
    const { erc1155, owner } = await loadFixture(deployERC1155Fixture); // Destructure owner

    await erc1155.mint(owner.address, 1, 1, "0x00000000");
    await erc1155.burn(owner.address, 1, 1);
    expect(await erc1155.balanceOf(owner.address, 1)).to.equal(0);
  });
});
