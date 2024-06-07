
export declare type ChainType = 'evm' | 'sol'

export interface TaskConfig {
  schemas: { schema_id: string }[];
  task_rpc: string;
  token: string;
}

export interface Task {
  task: string;
  node_address: string;
  node_host: string;
  node_port: number;
  node_pk: string;
  alloc_address: string;
  alloc_signature: string;
}

export interface VerifyResult {
  nullifierHash: string;
  publicFields: any[];
  signature: string;
  taskId: string;
  type: string;
}

export interface SolVerifyParams {
  task: string
  schema: string
  nullifier: string
  signature: string
  validatorAddress: string
  publicFieldsHash: string
  recipient: string
}

export interface Result {
  allocatorAddress: string;
  allocatorSignature: string;
  publicFields: any[];
  publicFieldsHash: string;
  taskId: string;
  uHash: string;
  validatorAddress: string;
  validatorSignature: string;
  recipient?: string;
}
