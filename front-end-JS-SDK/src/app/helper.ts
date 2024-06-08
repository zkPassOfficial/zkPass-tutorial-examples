import Web3 from "web3"
import { Buffer } from "buffer"
import secp256k1 from "secp256k1"
import * as borsh from "borsh"
import sha3 from 'js-sha3'
import { Attest, SolanaTask } from "./solanaInstruction"
import { EVMTaskAllocator, SolanaTaskAllocator } from "./constants"
import { SolVerifyParams } from "@zkpass/transgate-js-sdk/lib/types"

export function checkTaskInfoForSolana(task: string, schema: string, validatorAddress: string, signature: string) {
  const sig_bytes = hexToBytes(signature.slice(2));

  const signatureBytes = sig_bytes.slice(0, 64);
  const recoverId = Array.from(sig_bytes.slice(64))[0];

  const plaintext = borsh.serialize(SolanaTask, {
    task: task,
    schema: schema,
    notary: validatorAddress,
  });

  const plaintextHash = Buffer.from(sha3.keccak_256.digest(Buffer.from(plaintext)));

  const address = secp256k1.ecdsaRecover(signatureBytes, recoverId, plaintextHash, false);

  return SolanaTaskAllocator === sha3.keccak_256.hex(address.slice(1));
}

export function checkTaskInfoForEVM(task: string, schema: string, validatorAddress: string, signature: string) {
  const web3 = new Web3()

  const encodeParams = web3.eth.abi.encodeParameters(
    ["bytes32", "bytes32", "address"],
    [task, schema, validatorAddress]
  )
  const paramsHash = Web3.utils.soliditySha3(encodeParams) as string

  const signedAllocatorAddress = web3.eth.accounts.recover(paramsHash, signature)

  return EVMTaskAllocator === signedAllocatorAddress
}

export function verifyEVMMessageSignature(
  taskId: string,
  schema: string,
  uHash: string,
  publicFieldsHash: string,
  signature: string,
  originAddress: string,
  recipient?: string
) {
  const web3 = new Web3()

  const types = ["bytes32", "bytes32", "bytes32", "bytes32"]
  const values = [Web3.utils.stringToHex(taskId), Web3.utils.stringToHex(schema), uHash, publicFieldsHash]

  if (recipient) {
    types.push("address")
    values.push(recipient)
  }

  const encodeParams = web3.eth.abi.encodeParameters(types, values)

  const paramsHash = Web3.utils.soliditySha3(encodeParams) as string

  const nodeAddress = web3.eth.accounts.recover(paramsHash, signature)
  return nodeAddress === originAddress
}

/**
 * check signature is matched with task info
 * @param params
 * @returns
 */
export function verifySolanaMessageSignature(params: SolVerifyParams): boolean {
  const { taskId, uHash, validatorAddress, schema, validatorSignature, recipient, publicFieldsHash } = params;

    const sig_bytes = hexToBytes(validatorSignature.slice(2));

    const signatureBytes = sig_bytes.slice(0, 64);
    const recoverId = Array.from(sig_bytes.slice(64))[0];

    const plaintext = borsh.serialize(Attest, {
      task: taskId,
      nullifier: uHash,
      schema,
      recipient,
      publicFieldsHash,
    });

    const plaintextHash = Buffer.from(sha3.keccak_256.digest(Buffer.from(plaintext)));

    const address = secp256k1.ecdsaRecover(signatureBytes, recoverId, plaintextHash, false);

    return validatorAddress === sha3.keccak_256.hex(address.slice(1));
}

const hexToBytes = (hex: string) => {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substring(c, c + 2), 16));
  return new Uint8Array(bytes);
};