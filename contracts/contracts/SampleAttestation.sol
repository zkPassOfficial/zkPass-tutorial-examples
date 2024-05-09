// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Proof} from "./Common.sol";
import {ProofVerifier} from "./ProofVerifier.sol";

struct Attestation {
    bytes32 uid;
    bytes32 schema;
    bytes32 uHash;
    address recipient;
    bytes32 publicFieldsHash;
}

contract SampleAttestation is ProofVerifier {
    mapping(bytes32 uid => Attestation) private attestations;

    constructor() ProofVerifier() {}

    function attest(Proof calldata _proof) public {
        require(verify(_proof), "verify proof fail");

        Attestation memory attestation = Attestation({
            uid: 0,
            schema: _proof.schemaId,
            uHash: _proof.uHash,
            recipient: _proof.recipient,
            publicFieldsHash: _proof.publicFieldsHash
        });

        bytes32 uid;
        uint32 bump = 0;
        while (true) {
            uid = getUID(attestation, bump);
            if (attestations[uid].uid == 0) {
                break;
            }

            unchecked {
                ++bump;
            }
        }

        attestation.uid = uid;

        attestations[uid] = attestation;
    }

    function getAttestation(bytes32 uid) public view returns (Attestation memory) {
        return attestations[uid];
    }

    function getUID(Attestation memory attestation, uint32 bump) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    attestation.schema,
                    attestation.uHash,
                    attestation.recipient,
                    attestation.publicFieldsHash,
                    bump
                )
            );
    }
}
