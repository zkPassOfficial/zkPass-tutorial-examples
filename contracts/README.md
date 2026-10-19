# Tutorial contracts

Hardhat package `test-sdk-contract` for the zkPass Transgate samples. `contracts/ProofVerifier.sol` and `contracts/SampleAttestation.sol` use `pragma solidity ^0.8.20`. `hardhat.config.js` sets `solidity: "0.8.24"`.

`ProofVerifier.defaultAllocator` is `0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d`. `verify` returns true only when both `verifyAllocatorSignature` and `verifyValidatorSignature` return true. The allocator check recovers a signer over `keccak256(abi.encode(_taskId, _schemaId, _validator))` with the Ethereum signed-message prefix and compares it to `defaultAllocator`. The validator check recovers a signer over `keccak256(abi.encode(_taskId, _schemaId, _uHash, _publicFieldsHash, _recipient))` and compares it to the `_validator` argument. `SampleAttestation.attest` requires `verify(_proof)` and stores an `Attestation`.

No compile, test, or deploy was run for this revision.

## Commands

`package.json` script `test` is `npx hardhat test`. From this directory, after installing the devDependencies (`hardhat` `^2.20.1` and `@nomicfoundation/hardhat-toolbox` `^4.0.0`):

```bash
npx hardhat compile
npx hardhat test
```

`contracts/test/ProofVerifier.js` deploys `ProofVerifier` in the Hardhat network and expects `verify` to return true for one fixed proof object. That file is a local test, not a receipt from Sepolia. `contracts/test/SampleAttestation.js` is the other test file. This revision did not execute either file.

## Deploy config

`hardhat.config.js` defines one network, `sepolia`, with `chainId` `11155111` and URL `https://ethereum-sepolia-rpc.publicnode.com`. `accounts` is an array containing an empty string. Do not put a private key in this file or in this README. Supply a deployer key through a method that stays out of git, then point Hardhat at it.

The deploy scripts load the first signer and deploy one contract:

```bash
npx hardhat run scripts/deploy.verifier.js --network sepolia
npx hardhat run scripts/deploy.attestation.js --network sepolia
```

`scripts/deploy.verifier.js` deploys `ProofVerifier`. `scripts/deploy.attestation.js` deploys `SampleAttestation`. Neither script was run. An empty `accounts` entry is not a funded deployer.
