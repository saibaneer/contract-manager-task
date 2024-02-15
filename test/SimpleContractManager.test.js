const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleContractManager", function () {
    // Load the fixture
  async function deploySimpleContractManagerFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const SimpleContractManager = await ethers.getContractFactory(
      "SimpleContractManager"
    );
    const simpleContractManager = await SimpleContractManager.deploy();

    const encoderLibrary = await ethers.getContractFactory("EncoderWrapper");
    const encoder = await encoderLibrary.deploy();

    return { simpleContractManager, owner, alice, bob, encoder };
  }
  describe("Success", function () {
    it("Should deploy SimpleContractManager", async function () {
      const { simpleContractManager, owner } = await loadFixture(
        deploySimpleContractManagerFixture
      );
      const adminRole = await simpleContractManager.ADMIN_ROLE();

      expect(
        await simpleContractManager.hasRole(adminRole, owner.address)
      ).to.equal(true); // coonfirm that the owner has the admin role
    });
    it("Should add description for owner", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);

      await simpleContractManager.addDesc("Owner", owner.address);
      expect(
        await simpleContractManager.getContractDescription(owner.address)
      ).to.equal(await encoder.encodeString("Owner")); // confirm that owner can add description
    });
    it("Should update description for owner", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await simpleContractManager.addDesc("Owner", owner.address);
      await simpleContractManager.updateDesc(owner.address, "The Owner");
      expect(
        await simpleContractManager.getContractDescription(owner.address)
      ).to.equal(await encoder.encodeString("The Owner")); //confirm that owner can update description
    });
    it("Should delete description for owner", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await simpleContractManager.addDesc("Owner", owner.address);
      await simpleContractManager.removeDesc(owner.address);
      expect(
        await simpleContractManager.getContractDescription(owner.address)
      ).to.equal(ethers.ZeroHash); //confirm that owner can delete description
    });
  });
  describe("Failure: Access Controls", function () {
    it("Should fail to add description for non-owner, if not granted ADD role", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await expect(
        simpleContractManager
          .connect(alice)
          .addDesc("Owner", owner.address)
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "AccessRestricted()"
      ); //confirm that non-owner cannot add description
      await simpleContractManager
        .connect(owner)
        .grantRole(
          await simpleContractManager.ADD_CONTRACT_ROLE(),
          alice.address
        ); //granting the ADD role to alice
      expect(
        await simpleContractManager.hasRole(
          await simpleContractManager.ADD_CONTRACT_ROLE(),
          alice.address
        )
      ).to.equal(true);
      await simpleContractManager
        .connect(alice)
        .addDesc("Owner", owner.address); //alice can now add description
      expect(
        await simpleContractManager
          .connect(alice)
          .getContractDescription(owner.address)
      ).to.equal(await encoder.encodeString("Owner")); //confirm that alice can add description
    });
    it("Should fail to update description for non-owner, if not granted UPDATE role", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await simpleContractManager
        .connect(owner)
        .grantRole(
          await simpleContractManager.ADD_CONTRACT_ROLE(),
          alice.address
        ); //granting the ADD role to alice
      expect(
        await simpleContractManager.hasRole(
          await simpleContractManager.ADD_CONTRACT_ROLE(),
          alice.address
        )
      ).to.equal(true); //confirm that alice has the ADD role
      await simpleContractManager
        .connect(alice)
        .addDesc("Owner", owner.address);
      expect(
        await simpleContractManager
          .connect(alice)
          .getContractDescription(owner.address)
      ).to.equal(await encoder.encodeString("Owner")); //confirm that alice can add description
      await expect(
        simpleContractManager
          .connect(alice)
          .updateDesc(owner.address, "The Owner")
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "AccessRestricted()"
      ); //confirm that alice cannot update description
      await simpleContractManager
        .connect(owner)
        .grantRole(
          await simpleContractManager.UPDATE_CONTRACT_ROLE(),
          alice.address
        ); //granting the UPDATE role to alice
      expect(
        await simpleContractManager.hasRole(
          await simpleContractManager.UPDATE_CONTRACT_ROLE(),
          alice.address
        )
      ).to.equal(true); //confirm that alice has the UPDATE role
      await simpleContractManager
        .connect(alice)
        .updateDesc(owner.address, "The Owner");
      expect(
        await simpleContractManager
          .connect(alice)
          .getContractDescription(owner.address)
      ).to.equal(await encoder.encodeString("The Owner")); //confirm that alice can update description
    });
    it("Should fail to delete description for non-owner, if not granted DELETE role", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await simpleContractManager
        .connect(owner)
        .grantRole(
          await simpleContractManager.ADD_CONTRACT_ROLE(),
          alice.address
        ); //granting the ADD role to alice
      expect(
        await simpleContractManager.hasRole(
          await simpleContractManager.ADD_CONTRACT_ROLE(),
          alice.address
        )
      ).to.equal(true); //confirm that alice has the ADD role
      await simpleContractManager
        .connect(alice)
        .addDesc("Owner", owner.address);
      expect(
        await simpleContractManager
          .connect(alice)
          .getContractDescription(owner.address)
      ).to.equal(await encoder.encodeString("Owner")); //confirm that alice can add description
      await expect(
        simpleContractManager.connect(alice).removeDesc(owner.address)
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "AccessRestricted()"
      ); //confirm that alice cannot delete description
      await simpleContractManager
        .connect(owner)
        .grantRole(
          await simpleContractManager.REMOVE_CONTRACT_ROLE(),
          alice.address
        ); //granting the DELETE role to alice
      expect(
        await simpleContractManager.hasRole(
          await simpleContractManager.REMOVE_CONTRACT_ROLE(),
          alice.address
        )
      ).to.equal(true); //confirm that alice has the DELETE role
      await simpleContractManager.connect(alice).removeDesc(owner.address);
      expect(
        await simpleContractManager
          .connect(alice)
          .getContractDescription(owner.address)
      ).to.equal(ethers.ZeroHash); //confirm that alice can delete description
    });
  });
  describe("Failure: Invalid Inputs", function () {
    it("Should fail when zero address is passed while creating description", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await expect(
        simpleContractManager.addDesc("Owner", ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "AddressZeroNotAllowed()"
      ); //confirm that zero address is not allowed
    });
    it("Should fail when empty string is passed while creating description", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await expect(
        simpleContractManager.addDesc("", owner.address)
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "EmptyStringNotAllowed()"
      ); //confirm that empty string is not allowed
    });
    it("Should fail when zero address is passed while updating description", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await simpleContractManager.addDesc("Owner", owner.address);
      await expect(
        simpleContractManager.updateDesc(ethers.ZeroAddress, "The Owner")
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "AddressZeroNotAllowed()"
      ); 
    });
    it("Should fail when updating string with empty string", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await simpleContractManager.addDesc("Owner", owner.address);
      await expect(
        simpleContractManager.updateDesc(owner.address, "")
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "EmptyStringNotAllowed()"
      );
    });
    it("Should fail when attempting to create a description for an address that already has a description", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await simpleContractManager.addDesc("Owner", owner.address);
      await expect(
        simpleContractManager.addDesc("Owner", owner.address)
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "DescriptionAlreadyExists()"
      );
    });
    it("Should fail when attempting to update a description for an address that does not have a description", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await expect(
        simpleContractManager.updateDesc(owner.address, "The Owner")
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "DescriptionNotFound()"
      );
    });
    it("Should fail when attempting to delete a description for an address that does not have a description", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await expect(
        simpleContractManager.removeDesc(owner.address)
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "DescriptionNotFound()"
      );
    });
    it("Should fail when attempting to pass an address Zero while deleting a description", async function () {
      const { simpleContractManager, owner, alice, bob, encoder } =
        await loadFixture(deploySimpleContractManagerFixture);
      await expect(
        simpleContractManager.removeDesc(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(
        simpleContractManager,
        "AddressZeroNotAllowed()"
      );
    });
  });
});
