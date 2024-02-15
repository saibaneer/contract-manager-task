// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IContractManager {

    

    function getContractDescription(address _addr) external view returns (bytes32);
    function addDesc(string memory _desc, address _addr) external;
    function updateDesc(address _addr, string memory _newDescription) external;
    function removeDesc(address _addr) external;
}