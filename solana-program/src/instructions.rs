use borsh::{to_vec, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    keccak,
    pubkey::Pubkey,
    secp256k1_recover,
};

use crate::{
    error::ExampleError,
    state::{Attest, Attestation, AttestationRequest, ExampleDataV1, Task, EXAMPLE_PREFIX},
    utils::{create_pda_account, realloc_account},
};

pub fn attest(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    req: AttestationRequest,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let payer = next_account_info(account_info_iter)?;
    let data_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let (data_pk, data_bump) =
        Pubkey::find_program_address(&[EXAMPLE_PREFIX.as_bytes()], program_id);

    if data_account.key != &data_pk {
        return Err(ExampleError::DataAccountError.into());
    }

    //check sign
    let task = Task {
        task: req.task.clone(),
        schema: req.schema.clone(),
        notary: req.notary.clone(),
    };
    let msg_hash = keccak::hashv(&[&to_vec(&task).unwrap()]);
    let res = secp256k1_recover::secp256k1_recover(
        msg_hash.as_ref(),
        req.a_recovery_id,
        &req.a_signature,
    )
    .unwrap();

    if hex::encode(keccak::hashv(&[res.0.as_ref()]).as_ref())
        != "69e7d686e612ab57e3619f4a19a567b3b212a5b35ba0e3b600fbed5c2ee9083d".to_string()
    {
        return Err(ExampleError::VerificationFailed.into());
    }

    let a = Attest {
        task: req.task.clone(),
        schema: req.schema.clone(),
        nullifier: req.nullifier.clone(),
        recipient: req.recipient.clone(),
        public_fields_hash: req.public_fields_hash.clone(),
    };

    let msg_hash = keccak::hashv(&[&to_vec(&a).unwrap()]);
    let res = secp256k1_recover::secp256k1_recover(
        msg_hash.as_ref(),
        req.n_recovery_id,
        &req.n_signature,
    )
    .unwrap();

    if hex::encode(keccak::hashv(&[res.0.as_ref()]).as_ref()) != req.notary {
        return Err(ExampleError::VerificationFailed.into());
    }

    let at = Attestation {
        task: req.task.clone(),
        schema: req.schema.clone(),
        nullifier: req.nullifier.clone(),
        recipient: req.recipient.clone(),
        public_fields_hash: req.public_fields_hash.clone(),
    };

    let mut e_data = ExampleDataV1::new();
    e_data.attest = vec![at];
    if data_account.data_is_empty() {
        create_pda_account(
            program_id,
            to_vec(&e_data)?.len(),
            data_account,
            payer,
            system_program,
            &EXAMPLE_PREFIX.as_bytes(),
            data_bump,
        )?;
        e_data.serialize(&mut &mut data_account.data.borrow_mut()[..])?;
    } else {
        realloc_account(to_vec(&e_data)?.len(), data_account, payer, system_program)?;
        e_data.serialize(&mut &mut data_account.data.borrow_mut()[..])?;
    }

    Ok(())
}
