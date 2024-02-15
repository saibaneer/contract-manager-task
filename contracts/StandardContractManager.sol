// SPDX-License-Identifier: UNLICENSED

/**
 * @title StandardContractManager
 * @dev A contract that manages other contracts and their descriptions.
 * @notice Written by Gbenga Olutoba Ajiboye
 */
pragma solidity ^0.8.24;

import "./interfaces/IContractManager.sol";
import "./InternalFunctions.sol";

contract StandardContractManager is IContractManager, InternalFunctions {
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADD_CONTRACT_ROLE, msg.sender);
        _grantRole(UPDATE_CONTRACT_ROLE, msg.sender);
        _grantRole(REMOVE_CONTRACT_ROLE, msg.sender);
    }

    /**
     * @dev Retrieves the description of a contract.
     * @param _addr The address of the contract.
     * @return The description of the contract.
     */
    function getContractDescription(
        address _addr
    ) external view returns (bytes32) {
        return addrToDesc[_addr];
    }

    /**
     * @dev Adds a contract to the contract manager.
     * @param _desc The description of the contract.
     * @param _addr The address of the contract.
     */
    function addDesc(
        string memory _desc,
        address _addr
    ) external onlyAddRole {
        _addDescription(_desc, _addr);
       
    }

    /**
     * @dev Updates the description of a contract.
     * @param _addr The address of the contract.
     * @param _newDescription The new description of the contract.
     */
    function updateDesc(
        address _addr,
        string memory _newDescription
    ) external onlyUpdateRole {
        _updateDesc(_addr, _newDescription);
    }

    /**
     * @dev Removes a contract from the manager.
     * @param _addr The address of the contract.
     */
    function removeDesc(address _addr) external onlyRemoveRole {
        _removeDesc(_addr);
    }
}
