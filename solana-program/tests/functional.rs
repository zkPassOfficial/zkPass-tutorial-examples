// #![cfg(feature = "test-bpf")]
use {
    borsh::{BorshDeserialize},
    solana_program::instruction::{AccountMeta, Instruction},
    solana_program_test::*,
    solana_sdk::{
        signature::Signer, system_program, transaction::Transaction,pubkey::Pubkey
    },
    example::{process_instruction, processor::ExampleInstruction, state::{AttestationRequest, ExampleDataV1}},
};

#[tokio::test]
async fn test() {
    let program_id = Pubkey::new_unique();

    let (data_account_key, _) = Pubkey::find_program_address(&["example".as_bytes()], &program_id);

    let program_test = ProgramTest::new("example", program_id, processor!(process_instruction));
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    let mut a_signature = 
        hex::decode("e7f484adcaf1c8f53227901eaeed1f82cc49cfec5c36aefd31f9c6018ff56154359274fa0e33d0de3f9b9921e3c6c33f17c82e4431be572f0bfcd4cd65a31af101".to_string()).unwrap();
    let a_recovery_id = a_signature.pop().unwrap();

    let mut n_signature = 
        hex::decode("7c8ba261642fb3d4f4cb198071346ffcaeb8b7587f81a055fb0796e84c1cf0b5726fd1b7a88c2a7d13b8c75bca49e15b1ed51f80cee7bbf600c102e5ab20384600".to_string()).unwrap();
     let n_recovery_id =  n_signature.pop().unwrap();

    let attest = AttestationRequest {
        task: "859b2b19b1da468ba15090960066e65d".to_string(),
        schema: "c7eab8b7d7e44b05b41b613fe548edf5".to_string(),
        nullifier: "0xa3a5c8c3dd7dfe4abc91433fb9ad3de08344578713070983c905123b7ea91dda".to_string(),
        recipient: "A9Jk4bAebu5FNY3EvFF6Q6f86Sg38PE5fmVJbRugDpdf".to_string(),
        public_fields_hash: "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6".to_string(),
        a_recovery_id: a_recovery_id,
        a_signature: a_signature.try_into().unwrap(),
        n_recovery_id: n_recovery_id,
        n_signature: n_signature.try_into().unwrap(),
        notary: "e504ad91fbaad88362941a65b1c4c1e1cdd5cf69e27a3a08c8f51145c2e12c6a".to_string()
    };

    let transaction = Transaction::new_signed_with_payer(
        &[Instruction::new_with_borsh(
            program_id,
            &ExampleInstruction::Attest(attest),
            vec![
                AccountMeta::new(payer.pubkey(), true),            // payer
                AccountMeta::new(data_account_key.clone(), false), // data
                AccountMeta::new_readonly(system_program::id(), false),
            ],
        )],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );
    banks_client
        .process_transaction_with_metadata(transaction)
        .await
        .unwrap();

    let data = match banks_client
        .get_account(data_account_key.clone())
        .await
        .unwrap()
    {
        Some(account) => ExampleDataV1::try_from_slice(&account.data).unwrap(),
        None => panic!(),
    };
    println!("{:?}", data.attest);
}
