// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


abstract contract ContractManagerStorage {
    mapping (address => bytes32) internal addrToDesc;

    bytes32 public constant ADD_CONTRACT_ROLE = keccak256("ADD_CONTRACT_ROLE");
    bytes32 public constant UPDATE_CONTRACT_ROLE = keccak256("UPDATE_CONTRACT_ROLE");
    bytes32 public constant REMOVE_CONTRACT_ROLE = keccak256("REMOVE_CONTRACT_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
}