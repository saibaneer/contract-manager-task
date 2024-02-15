// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "../libs/Encoder.sol";

contract EncoderWrapper {
    using Encoder for string;

    function encodeString(string memory _desc) public pure returns (bytes32) {
        return _desc.encodeString();
    }

}