// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./libs/Encoder.sol";
import "./libs/Errors.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SimpleContractManager
 * @dev A contract that manages contracts by storing their descriptions based on their addresses.
 *      It provides functions to add, update, and remove contract descriptions.
 */
contract SimpleContractManager is AccessControl {
    using Encoder for string;
    using Errors for *;

    event DescriptionAdded(address indexed addr, bytes32 description);
    event DescriptionUpdated(address indexed addr, bytes32 oldDescription, bytes32 newDescription);
    event DescriptionRemoved(address indexed addr, bytes32 description);

    /**
     * @dev This contract manages the mapping of addresses to contract descriptions.
     */
    mapping(address => bytes32) addrToDesc;

    /**
     * @dev Role identifier for adding contracts.
     */
    bytes32 public constant ADD_CONTRACT_ROLE = keccak256("ADD_CONTRACT_ROLE");

    /**
     * @dev Role identifier for updating contracts.
     */
    bytes32 public constant UPDATE_CONTRACT_ROLE =
        keccak256("UPDATE_CONTRACT_ROLE");

    /**
     * @dev Role identifier for removing contracts.
     */
    bytes32 public constant REMOVE_CONTRACT_ROLE =
        keccak256("REMOVE_CONTRACT_ROLE");

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADD_CONTRACT_ROLE, msg.sender);
        _grantRole(UPDATE_CONTRACT_ROLE, msg.sender);
        _grantRole(REMOVE_CONTRACT_ROLE, msg.sender);
    }

    /**
     * @dev Adds a description to the contract manager.
     * @param _desc The description of the contract.
     * @param _addr The address of the contract.
     */
    function addDesc(string memory _desc, address _addr) public {
        if (_addr == address(0)) {
            revert Errors.AddressZeroNotAllowed();
        }
        if (bytes(_desc).length == 0) {
            revert Errors.EmptyStringNotAllowed();
        }
        if (addrToDesc[_addr] != bytes32(0)) {
            revert Errors.DescriptionAlreadyExists();
        }
        if (!hasRole(ADD_CONTRACT_ROLE, msg.sender)) {
            revert Errors.AccessRestricted();
        }
        bytes32 descHash = _desc.encodeString();
        addrToDesc[_addr] = descHash;
        emit DescriptionAdded(_addr, descHash);
    }

    /**
     * @dev Retrieves the description of a contract.
     * @param _addr The address of the contract.
     * @return The description of the contract.
     */
    function getContractDescription(
        address _addr
    ) public view returns (bytes32) {
        return addrToDesc[_addr];
    }

    /**
     * @dev Updates the description of a contract.
     * @param _addr The address of the contract.
     * @param _newDescription The new description of the contract.
     */
    function updateDesc(address _addr, string memory _newDescription) public {
        if (_addr == address(0)) {
            revert Errors.AddressZeroNotAllowed();
        }
        if (bytes(_newDescription).length == 0) {
            revert Errors.EmptyStringNotAllowed();
        }
        if (addrToDesc[_addr] == bytes32(0)) {
            revert Errors.DescriptionNotFound();
        }
        if (!hasRole(UPDATE_CONTRACT_ROLE, msg.sender)) {
            revert Errors.AccessRestricted();
        }

        bytes32 newDescHash = _newDescription.encodeString();
        bytes32 oldDescHash = addrToDesc[_addr];
        addrToDesc[_addr] = newDescHash;
        emit DescriptionUpdated(_addr, oldDescHash, newDescHash);
    }

    /**
     * @dev Removes a contract from the manager.
     * @param _addr The address of the contract.
     */
    function removeDesc(address _addr) public {
        if (_addr == address(0)) {
            revert Errors.AddressZeroNotAllowed();
        }
        if (addrToDesc[_addr] == bytes32(0)) {
            revert Errors.DescriptionNotFound();
        }
        if (!hasRole(REMOVE_CONTRACT_ROLE, msg.sender)) {
            revert Errors.AccessRestricted();
        }
        delete addrToDesc[_addr];
        emit DescriptionRemoved(_addr, addrToDesc[_addr]);
    }
}
