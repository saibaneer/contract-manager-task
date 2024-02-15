<h2>Design Justifications: Contract Manager</h2>


I created 2 types of Contracts: `SimpleContractManager`, and `StandardContractManager`.

<h2>SimpleContractManager.sol</h2>




* Uses a monolithic approach to design (not ideal)
* Lightweight, and easy to read.
* Marginally smaller in size than the StandardContractManager. The size of the SimpleContractManager is 5.1 KB unoptimised, 5.9 Kb optimised at 200 runs.
* I don’t prefer this approach, as it does not scale neatly.

<h2>StandardContractManager.sol</h2>




* Uses a modular, object oriented approach.
* Leverages the strengths of Solidity’s Inheritance properties, separating storage, errors, logic, interfaces, internal and public functions.
* Clean and uses single entry point => StandardContractManager.sol
* Marginally larger than the SimpleContract, 5.2 KB unoptimised, 6.0 KB optimised at 200 runs.
* Complex to read, unless one has knowledge of how solidity inheritances and libraries work.

---


<h2>Data Structure choices.</h2>


The choice of going with a mapping of type mapping(address => bytes32) were driven by the following user requirements:



* The contract should enable storage of multiple contract addresses. Each address should be associated with a textual description (string).
* Implement functionality to add new contract addresses with their descriptions.
* Create a function to update the description of an existing contract address

    Since mappings tend to store ONLY the value in a hash table, where the location of that storage is the keccak256 hash of (key, mapping slot), then each address key will map to only 1 unique 32 byte slot in the Hash table. This means updates, will write to the same slot, and delete, will reset that slot.


The choice to use an address =>bytes32 instead of address => string, was as a result of:



* Strings are more expensive to store in storage than Bytes32 (which is the default slot stack used for the EVM)
* Each string character represents 1 token, that is stored in a single 32 bytes slot. Thus, mapping to String would bloat the contract.
* Also, since there was no read requirement that necessitates reading the string in unicode form, there was no need to store the description as a unicode type string, or byte string.

<h2>StandardContractStorage Architecture</h2>

https://github.com/saibaneer/contract-manager-task/blob/d8f6878ddafa8e50f3ce8f6a2134e903b338b443/InheriticanceGraph.png

* Use of libraries. 

The choice to use libraries to store encoding, and error information is in line with best practices, modeled by AaveV3 contracts. I created a single entry point and made the entry point contract clean and easy to read, at minimum cost. Since libraries and not actual contracts, they add marginally to the runtime cost of the contract.

* Use of Internal Function abstract contract. 

The choice to include all core logic as internal functions is also in line with best practices set forth by OpenZeppelin. Where the main entry point contract is clean and easy to ready, while internal functions which hold core logic are separated, and uncallable directly since they are all internal. 


The internal functions are made abstract, as they will not be called directly or be interfacing with users. 


This also allows for all Check-Effect-Interaction patterns to be done at the internal level, also allowing the entry point contract to look as clean as possible.

* Use of IContractManager interface. 

The choice to use the interface is to ensure that when implementing a contract of type StandardContractManager, at the very least all those key 4 functions.

* Use of an inherited Storage. 

To achieve consistency with the Internal Abstract contract, it was necessary that the storage architecture of the entry point, and the internal function be exactly the same. To achieve this, on the ContractManagerStorage.sol, the mapping was set to internal so it could be inherited.

* Access Controls

In line with the user specifications, openZeppelin’s Access Control.sol(v5) was inherited. The requirement doc outlined implicitly that roles should be authorised for each of the functions.


    To this end:

* The Standard Contract Manager inherited the AccessControl.sol contract via its internal contract.
* Leveraged its ability to grant roles to several types of users, to create role modifiers, where only a user with a specific role modifier can call a function.
* A user with only an `addDescription` role, will only be able to call this function. Calling any other function outside of this will fail, unless the Default Admin Role grants the user a right to call another function,
* The default admin role is created, and setup within the constructor as the deployer of the contract. It has the right to call ALL the functions. Lines 15-20 (StandardContractManager.sol)
* The role modifiers serve as guards for each function.
* The logic for the role modifiers are written in the Internal Functions abstract contract.
