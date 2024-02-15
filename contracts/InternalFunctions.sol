// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./ContractStorage.sol";
import "./libs/Encoder.sol";
import "./libs/Errors.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract InternalFunctions is AccessControl, ContractManagerStorage {
    using Encoder for string;
    using Errors for *;

    event DescriptionAdded(address indexed addr, bytes32 description);
    event DescriptionUpdated(address indexed addr, bytes32 oldDescription, bytes32 newDescription);
    event DescriptionRemoved(address indexed addr, bytes32 description);
    /**
     * @dev Modifier to restrict access to functions that require the "add" role.
     * Reverts with an "AccessRestricted" error if the sender does not have the role.
     */
    modifier onlyAddRole() {
        if (!_hasAddRole(msg.sender)) {
            revert Errors.AccessRestricted();
        }
        _;
    }

    /**
     * @dev Modifier to restrict access to functions that require the "update" role.
     * Reverts with an "AccessRestricted" error if the sender does not have the role.
     */
    modifier onlyUpdateRole() {
        if (!_hasUpdateRole(msg.sender)) {
            revert Errors.AccessRestricted();
        }
        _;
    }

    /**
     * @dev Modifier to restrict access to functions that require the "remove" role.
     * Reverts with an "AccessRestricted" error if the sender does not have the role.
     */
    modifier onlyRemoveRole() {
        if (!_hasRemoveRole(msg.sender)) {
            revert Errors.AccessRestricted();
        }
        _;
    }

    /**
     * @dev Adds a contract to the system with the given description and address.
     * Reverts with an error if the address is zero, the description is empty, or the description already exists.
     * @param _desc The description of the contract.
     * @param _addr The address of the contract.
     */
    function _addDescription(string memory _desc, address _addr) internal {
        if (_addr == address(0)) {
            revert Errors.AddressZeroNotAllowed();
        }
        if (bytes(_desc).length == 0) {
            revert Errors.EmptyStringNotAllowed();
        }
        if (addrToDesc[_addr] != bytes32(0)) {
            revert Errors.DescriptionAlreadyExists();
        }
      
        bytes32 descHash = _desc.encodeString();
        addrToDesc[_addr] = descHash;
         emit DescriptionAdded(_addr, descHash);
    }

    /**
     * @dev Updates the description of a contract with the given address.
     * Reverts with an error if the address is zero, the new description is empty, or the description does not exist.
     * @param _addr The address of the contract.
     * @param _newDescription The new description of the contract.
     */
    function _updateDesc(
        address _addr,
        string memory _newDescription
    ) internal {
        if (_addr == address(0)) {
            revert Errors.AddressZeroNotAllowed();
        }
        if (bytes(_newDescription).length == 0) {
            revert Errors.EmptyStringNotAllowed();
        }
        if (addrToDesc[_addr] == bytes32(0)) {
            revert Errors.DescriptionNotFound();
        }
        /**
         *
         * @dev Since the storage location of a key is computed by 
         * Keccak256(key, mapping-slot), an updated key stores its value in 
         * the same location as the previous value. 
         * See : https://medium.com/coinmonks/solidity-tutorial-all-about-mappings-29a12269ee14
         */
        bytes32 newDescHash = _newDescription.encodeString();
        bytes32 oldDescHash = addrToDesc[_addr];
        addrToDesc[_addr] = newDescHash;
        emit DescriptionUpdated(_addr, oldDescHash, newDescHash);
    }

    /**
     * @dev Removes a contract from the system with the given address.
     * Reverts with an error if the address is zero or the description does not exist.
     * @param _addr The address of the contract.
     */
    function _removeDesc(address _addr) internal {
        if (_addr == address(0)) {
            revert Errors.AddressZeroNotAllowed();
        }
        if (addrToDesc[_addr] == bytes32(0)) {
            revert Errors.DescriptionNotFound();
        }
        //same principle as the update function
        delete addrToDesc[_addr];
        emit DescriptionRemoved(_addr, addrToDesc[_addr]);
    }

    /**
     * @dev Checks if the caller has the 'ADD_CONTRACT_ROLE'.
     * @param _caller The address of the caller.
     * @return A boolean indicating whether the caller has the 'ADD_CONTRACT_ROLE'.
     */
    function _hasAddRole(address _caller) internal view returns (bool) {
        return hasRole(ADD_CONTRACT_ROLE, _caller);
    }

    /**
     * @dev Checks if the caller has the 'UPDATE_CONTRACT_ROLE'.
     * @param _caller The address of the caller.
     * @return A boolean indicating whether the caller has the 'UPDATE_CONTRACT_ROLE'.
     */
    function _hasUpdateRole(address _caller) internal view returns (bool) {
        return hasRole(UPDATE_CONTRACT_ROLE, _caller);
    }

    /**
     * @dev Checks if the caller has the 'REMOVE_CONTRACT_ROLE'.
     * @param _caller The address of the caller.
     * @return A boolean indicating whether the caller has the 'REMOVE_CONTRACT_ROLE'.
     */
    function _hasRemoveRole(address _caller) internal view returns (bool) {
        return hasRole(REMOVE_CONTRACT_ROLE, _caller);
    }
}
