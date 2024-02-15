// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


library Errors {
    error DescriptionAlreadyExists();
    error AddressZeroNotAllowed();
    error EmptyStringNotAllowed();
    error DescriptionNotFound();
    error AccessRestricted();
}