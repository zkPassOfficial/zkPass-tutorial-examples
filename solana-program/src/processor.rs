//! Program instruction processor
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey};

use crate::{instructions::attest, state::AttestationRequest};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum ExampleInstruction {
    Attest(AttestationRequest),
}

/// Instruction processor
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    input: &[u8],
) -> ProgramResult {
    let instruction = ExampleInstruction::try_from_slice(input)?;
    match instruction {
        ExampleInstruction::Attest(req) => attest(program_id, accounts, req),
    }
}