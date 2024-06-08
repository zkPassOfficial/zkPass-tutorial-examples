use borsh::BorshDeserialize;
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

use crate::state::ExampleDataV1;

pub fn create_pda_account<'info>(
    program_id: &Pubkey,
    span: usize,
    data_account: &AccountInfo<'info>,
    payer: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
    seed: &[u8],
    bump: u8,
) -> ProgramResult {
    let lamports_required = (Rent::get()?).minimum_balance(span);
    invoke_signed(
        &system_instruction::create_account(
            payer.key,
            data_account.key,
            lamports_required,
            span as u64,
            program_id,
        ),
        &[payer.clone(), data_account.clone(), system_program.clone()],
        &[&[seed, &[bump]]],
    )?;
    Ok(())
}

pub fn realloc_account<'info>(
    span: usize,
    data_account: &AccountInfo<'info>,
    payer: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
) -> ProgramResult {
    let lamports_required = (Rent::get()?).minimum_balance(span);
    if lamports_required > data_account.lamports() {
        let diff = lamports_required - data_account.lamports();
        invoke(
            &system_instruction::transfer(payer.key, data_account.key, diff),
            &[payer.clone(), data_account.clone(), system_program.clone()],
        )?;
    }

    data_account.realloc(span, false)?;
    Ok(())
}

pub fn close_account<'info>(
    manager: &AccountInfo<'info>,
    close: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
) -> ProgramResult {
    let account_span = 0usize;
    let lamports_required = (Rent::get()?).minimum_balance(account_span);

    let diff = close.lamports() - lamports_required;

    // Send the rent back to the payer
    **close.lamports.borrow_mut() -= diff;
    **manager.lamports.borrow_mut() += diff;

    // Realloc the account to zero
    close.realloc(account_span, true)?;

    // Assign the account to the System Program
    close.assign(system_program.key);

    Ok(())
}

pub fn unpack_pda_data(src: &[u8]) -> Result<ExampleDataV1, ProgramError> {
    if src[0] == 1 {
        Ok(ExampleDataV1::try_from_slice(src)?)
    } else {
        // conversion_logic
        // todo PDADataV2 PDADataV3......
        Ok(ExampleDataV1::try_from_slice(src)?)
    }
}
