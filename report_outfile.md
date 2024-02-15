## Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| contracts/ContractStorage.sol | [object Promise] |
| contracts/InternalFunctions.sol | [object Promise] |
| contracts/SimpleContractManager.sol | [object Promise] |
| contracts/StandardContractManager.sol | [object Promise] |
| contracts/interfaces/IContractManager.sol | [object Promise] |
| contracts/libs/Encoder.sol | [object Promise] |
| contracts/libs/Errors.sol | [object Promise] |
| contracts/mocks/EncoderWrapper.sol | [object Promise] |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **ContractManagerStorage** | Implementation |  |||
||||||
| **InternalFunctions** | Implementation | AccessControl, ContractManagerStorage |||
| └ | _addDescription | Internal 🔒 | 🛑  | |
| └ | _updateDesc | Internal 🔒 | 🛑  | |
| └ | _removeDesc | Internal 🔒 | 🛑  | |
| └ | _hasAddRole | Internal 🔒 |   | |
| └ | _hasUpdateRole | Internal 🔒 |   | |
| └ | _hasRemoveRole | Internal 🔒 |   | |
||||||
| **SimpleContractManager** | Implementation | AccessControl |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | addDesc | Public ❗️ | 🛑  |NO❗️ |
| └ | getContractDescription | Public ❗️ |   |NO❗️ |
| └ | updateDesc | Public ❗️ | 🛑  |NO❗️ |
| └ | removeDesc | Public ❗️ | 🛑  |NO❗️ |
||||||
| **StandardContractManager** | Implementation | IContractManager, InternalFunctions |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | getContractDescription | External ❗️ |   |NO❗️ |
| └ | addDesc | External ❗️ | 🛑  | onlyAddRole |
| └ | updateDesc | External ❗️ | 🛑  | onlyUpdateRole |
| └ | removeDesc | External ❗️ | 🛑  | onlyRemoveRole |
||||||
| **IContractManager** | Interface |  |||
| └ | getContractDescription | External ❗️ |   |NO❗️ |
| └ | addDesc | External ❗️ | 🛑  |NO❗️ |
| └ | updateDesc | External ❗️ | 🛑  |NO❗️ |
| └ | removeDesc | External ❗️ | 🛑  |NO❗️ |
||||||
| **Encoder** | Library |  |||
| └ | encodeString | Internal 🔒 |   | |
||||||
| **Errors** | Library |  |||
||||||
| **EncoderWrapper** | Implementation |  |||
| └ | encodeString | Public ❗️ |   |NO❗️ |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
