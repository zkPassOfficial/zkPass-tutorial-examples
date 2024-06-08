use borsh::{BorshDeserialize, BorshSerialize};

pub const EXAMPLE_PREFIX: &str = "example";

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct Task {
    pub task: String,
    pub schema: String,
    pub notary: String
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct Attest {
    pub task: String,
    pub schema: String,
    pub nullifier: String,
    pub recipient: String,
    pub public_fields_hash: String,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct AttestationRequest {
    pub task: String,
    pub schema: String,
    pub nullifier: String,
    pub recipient: String,
    pub public_fields_hash: String,
    pub a_recovery_id: u8,
    pub a_signature: [u8; 64],
    pub n_recovery_id: u8,
    pub n_signature: [u8; 64],
    pub notary: String,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct Attestation {
    pub task: String,
    pub schema: String,
    pub nullifier: String,
    pub recipient: String,
    pub public_fields_hash: String,
}


#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct ExampleDataV1 {
    pub data_version: u8,
    pub attest: Vec<Attestation>,
}

impl ExampleDataV1 {
    pub fn new() -> Self {
        ExampleDataV1 {
            data_version: 1,
            attest: Vec::new(),
        }
    }
}