import Web3 from "web3"

/**
 * check signature is matched with task info
 * @param taskId
 * @param schemaId
 * @param uHash
 * @param publicData
 * @param signature
 * @param validatorAddress
 * @param recipient
 * @returns
 */
export const verifyMessageSignature = (
  taskId: string,
  schemaId: string,
  uHash: string,
  publicFieldsHash: string,
  signature: string,
  validatorAddress: string,
  recipient?: string
) => {
  const web3 = new Web3()
  
  const taskIdHex = Web3.utils.stringToHex(taskId)
  const schemaIdHex = Web3.utils.stringToHex(schemaId)
  const types = ['bytes32', 'bytes32', 'bytes32', 'bytes32'];
  const values = [taskIdHex, schemaIdHex, uHash, publicFieldsHash];

  if (recipient) {
    types.push('address');
    values.push(recipient);
  }

  console.log('types', types)
  console.log('values', values)

  const encodeParams = web3.eth.abi.encodeParameters(types, values);

  const paramsHash = Web3.utils.soliditySha3(encodeParams) as string

  const nodeAddress = web3.eth.accounts.recover(paramsHash, signature)
  return nodeAddress === validatorAddress
}
