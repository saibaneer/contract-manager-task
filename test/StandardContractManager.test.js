const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const { ethers } = require("hardhat");
  
  describe("StandardContractManager", function () {
    /**
     * 
     * @note The fixture function is used to deploy the contract and set up the test environment.
     */
    async function deployStandardContractManagerFixture() {
      const [owner, alice, bob] = await ethers.getSigners();
      const StandardContractManager = await ethers.getContractFactory(
        "StandardContractManager"
      );
      const standardContractManager = await StandardContractManager.deploy();
  
      const encoderLibrary = await ethers.getContractFactory("EncoderWrapper");
      const encoder = await encoderLibrary.deploy();
  
      return { standardContractManager, owner, alice, bob, encoder };
    }
    describe("Success", function () {
      it("Should deploy standardContractManager", async function () {
        const { standardContractManager, owner } = await loadFixture(
          deployStandardContractManagerFixture
        );
        const adminRole = await standardContractManager.ADMIN_ROLE(); // admin role
        expect(
          await standardContractManager.hasRole(adminRole, owner.address)
        ).to.equal(true); // owner has admin role
      });
      it("Should add description for owner", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
  
        await standardContractManager.addDesc("Owner", owner.address);
        expect(
          await standardContractManager.getContractDescription(owner.address)
        ).to.equal(await encoder.encodeString("Owner")); //confirm that owner can set description
      });
      it("Should update description for owner", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await standardContractManager.addDesc("Owner", owner.address);
        await standardContractManager.updateDesc(owner.address, "The Owner");
        expect(
          await standardContractManager.getContractDescription(owner.address)
        ).to.equal(await encoder.encodeString("The Owner")); //confirm that owner can update description
      });
      it("Should delete description for owner", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await standardContractManager.addDesc("Owner", owner.address);
        await standardContractManager.removeDesc(owner.address);
        expect(
          await standardContractManager.getContractDescription(owner.address)
        ).to.equal(ethers.ZeroHash); //confirm that owner can delete description
      });
    });
    describe("Failure: Access Controls", function () {
      it("Should fail to add description for non-owner, if not granted ADD role", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await expect(
          standardContractManager
            .connect(alice)
            .addDesc("Owner", owner.address)
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "AccessRestricted()"
        ); //alice is not allowed to add description
        await standardContractManager
          .connect(owner)
          .grantRole(
            await standardContractManager.ADD_CONTRACT_ROLE(),
            alice.address
          );
        expect(
          await standardContractManager.hasRole(
            await standardContractManager.ADD_CONTRACT_ROLE(),
            alice.address
          )
        ).to.equal(true); //alice is granted ADD role
        await standardContractManager
          .connect(alice)
          .addDesc("Owner", owner.address);
        expect(
          await standardContractManager
            .connect(alice)
            .getContractDescription(owner.address)
        ).to.equal(await encoder.encodeString("Owner")); //alice can now add description
      });
      it("Should fail to update description for non-owner, if not granted UPDATE role", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await standardContractManager
          .connect(owner)
          .grantRole(
            await standardContractManager.ADD_CONTRACT_ROLE(),
            alice.address
          ); //grant alice ADD role
        expect(
          await standardContractManager.hasRole(
            await standardContractManager.ADD_CONTRACT_ROLE(),
            alice.address
          )
        ).to.equal(true); //alice has ADD role
        await standardContractManager
          .connect(alice)
          .addDesc("Owner", owner.address);
        expect(
          await standardContractManager
            .connect(alice)
            .getContractDescription(owner.address)
        ).to.equal(await encoder.encodeString("Owner")); //alice has added description
        await expect(
          standardContractManager
            .connect(alice)
            .updateDesc(owner.address, "The Owner")
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "AccessRestricted()"
        ); //alice is not allowed to update description
        await standardContractManager
          .connect(owner)
          .grantRole(
            await standardContractManager.UPDATE_CONTRACT_ROLE(),
            alice.address
          ); //grant alice UPDATE role
        expect(
          await standardContractManager.hasRole(
            await standardContractManager.UPDATE_CONTRACT_ROLE(),
            alice.address
          )
        ).to.equal(true); //alice has UPDATE role
        await standardContractManager
          .connect(alice)
          .updateDesc(owner.address, "The Owner");
        expect(
          await standardContractManager
            .connect(alice)
            .getContractDescription(owner.address)
        ).to.equal(await encoder.encodeString("The Owner")); //alice can now update description
      });
      it("Should fail to delete description for non-owner, if not granted DELETE role", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await standardContractManager
          .connect(owner)
          .grantRole(
            await standardContractManager.ADD_CONTRACT_ROLE(),
            alice.address
          ); //grant alice ADD role
        expect(
          await standardContractManager.hasRole(
            await standardContractManager.ADD_CONTRACT_ROLE(),
            alice.address
          )
        ).to.equal(true); //alice has ADD role
        await standardContractManager
          .connect(alice)
          .addDesc("Owner", owner.address);
        expect(
          await standardContractManager
            .connect(alice)
            .getContractDescription(owner.address)
        ).to.equal(await encoder.encodeString("Owner")); //alice has added description
        await expect(
          standardContractManager.connect(alice).removeDesc(owner.address)
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "AccessRestricted()"
        ); //alice is not allowed to delete description
        await standardContractManager
          .connect(owner)
          .grantRole(
            await standardContractManager.REMOVE_CONTRACT_ROLE(),
            alice.address
          ); //grant alice DELETE role
        expect(
          await standardContractManager.hasRole(
            await standardContractManager.REMOVE_CONTRACT_ROLE(),
            alice.address
          )
        ).to.equal(true); //alice has DELETE role
        await standardContractManager.connect(alice).removeDesc(owner.address);
        expect(
          await standardContractManager
            .connect(alice)
            .getContractDescription(owner.address)
        ).to.equal(ethers.ZeroHash); //alice can now delete description
      });
    });
    describe("Failure: Invalid Inputs", function () {
      it("Should fail when zero address is passed while creating description", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await expect(
          standardContractManager.addDesc("Owner", ethers.ZeroAddress)
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "AddressZeroNotAllowed()"
        );
      });
      it("Should fail when empty string is passed while creating description", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await expect(
          standardContractManager.addDesc("", owner.address)
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "EmptyStringNotAllowed()"
        );
      });
      it("Should fail when zero address is passed while updating description", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await standardContractManager.addDesc("Owner", owner.address);
        await expect(
          standardContractManager.updateDesc(ethers.ZeroAddress, "The Owner")
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "AddressZeroNotAllowed()"
        );
      });
      it("Should fail when updating string with empty string", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await standardContractManager.addDesc("Owner", owner.address);
        await expect(
          standardContractManager.updateDesc(owner.address, "")
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "EmptyStringNotAllowed()"
        );
      });
      it("Should fail when attempting to create a description for an address that already has a description", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await standardContractManager.addDesc("Owner", owner.address);
        await expect(
          standardContractManager.addDesc("Owner", owner.address)
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "DescriptionAlreadyExists()"
        );
      });
      it("Should fail when attempting to update a description for an address that does not have a description", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await expect(
          standardContractManager.updateDesc(owner.address, "The Owner")
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "DescriptionNotFound()"
        );
      });
      it("Should fail when attempting to delete a description for an address that does not have a description", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await expect(
          standardContractManager.removeDesc(owner.address)
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "DescriptionNotFound()"
        );
      });
      it("Should fail when attempting to pass an address Zero while deleting a description", async function () {
        const { standardContractManager, owner, alice, bob, encoder } =
          await loadFixture(deployStandardContractManagerFixture);
        await expect(
          standardContractManager.removeDesc(ethers.ZeroAddress)
        ).to.be.revertedWithCustomError(
          standardContractManager,
          "AddressZeroNotAllowed()"
        );
      });
    });
  });
  