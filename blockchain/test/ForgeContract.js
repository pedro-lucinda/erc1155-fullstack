const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ForgingContract", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    [owner, otherAccount] = await ethers.getSigners();

    const ERC1155 = await ethers.getContractFactory("ERC1155Token");
    const token = await ERC1155.deploy("url");

    ForgingContract = await ethers.getContractFactory("ForgingContract");
    forge = await ForgingContract.deploy(token.target);

    await token.transferOwnership(forge.target);

    return { token, forge, owner, otherAccount };
  }

  beforeEach(async () => {});

  describe("Minting", function () {
    it("Should mint a token with a valid ID", async function () {
      const { forge, token, owner } = await loadFixture(deployFixture);

      await forge.mint(0);

      expect(await token.balanceOf(owner.address, 0)).to.equal(1);
    });

    it("Shouldn't mint a token with an invalid ID", async function () {
      const { forge } = await loadFixture(deployFixture);

      await expect(forge.mint(10)).to.be.revertedWith(
        "Invalid token ID for minting"
      );
    });

    it("Should respect the minting cooldown", async function () {
      const { forge } = await loadFixture(deployFixture);

      await forge.mint(0);
      await expect(forge.mint(0)).to.be.revertedWith("Cooldown in effect");
    });
  });

  describe("Forging", function () {
    it("Should forge token with ID 3", async function () {
      const { forge, token } = await loadFixture(deployFixture);

      await forge.mint(0);
      await forge.resetCooldown();
      await forge.mint(1);
      await forge.forge(3);

      expect(await token.balanceOf(owner.address, 3)).to.equal(1);
    });

    it("Shouldn't forge with an invalid ID", async function () {
      const { forge } = await loadFixture(deployFixture);

      await forge.mint(0);
      await forge.resetCooldown();
      await forge.mint(1);
      await forge.resetCooldown();
      await forge.mint(2);

      await expect(forge.forge(10)).to.be.revertedWith("Invalid forge ID");
    });
  });

  describe("Trading", function () {
    it("Should trade token 0 for token 3", async function () {
      const { forge, token } = await loadFixture(deployFixture);
      await forge.mint(0);
      await forge.trade(0, 3);

      expect(await token.balanceOf(owner.address, 0)).to.equal(0);
      expect(await token.balanceOf(owner.address, 3)).to.equal(1);
    });

    it("Shouldn't trade with an invalid ID", async function () {
      const { forge } = await loadFixture(deployFixture);

      await expect(forge.trade(0, 10)).to.be.revertedWith(
        "Invalid trade_token_id"
      );
    });
  });

  describe("Burning", function () {
    it("Should burn a token", async function () {
      const { forge, token } = await loadFixture(deployFixture);
      await forge.mint(0);
      await forge.burn(0);

      expect(await token.balanceOf(owner.address, 0)).to.equal(0);
    });

    it("Shouldn't burn with an invalid ID", async function () {
      const { forge } = await loadFixture(deployFixture);
      await forge.mint(0);
     
      await expect(forge.burn(10)).to.be.revertedWith(
        "Invalid token ID for burning"
      );
    });
  });
});
