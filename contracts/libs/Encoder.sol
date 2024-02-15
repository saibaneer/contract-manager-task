// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


library Encoder {
    
    function encodeString(string memory _desc) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_desc));
    }

    
}