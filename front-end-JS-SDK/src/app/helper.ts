import Web3 from "web3"

/**
 * check signature is matched with task info
 * @param taskId
 * @param schemaId
 * @param uHash
 * @param publicData
 * @param signature
 * @param validatorAddress
 * @returns
 */
export const verifyMessageSignature = (
  taskId: string,
  schemaId: string,
  uHash: string,
  publicFieldsHash: string,
  signature: string,
  validatorAddress: string
) => {
  const web3 = new Web3()
  
  const taskIdHex = Web3.utils.stringToHex(taskId)
  const schemaIdHex = Web3.utils.stringToHex(schemaId)

  const encodeParams = web3.eth.abi.encodeParameters(
    ["bytes32", "bytes32", "bytes32", "bytes32"],
    [taskIdHex, schemaIdHex, uHash, publicFieldsHash]
  )

  const paramsHash = Web3.utils.soliditySha3(encodeParams) as string

  const nodeAddress = web3.eth.accounts.recover(paramsHash, signature)
  return nodeAddress === validatorAddress
}
