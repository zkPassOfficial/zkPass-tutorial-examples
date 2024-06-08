use num_derive::FromPrimitive;
use solana_program::{decode_error::DecodeError, program_error::ProgramError};

/// Errors that may be returned by the Token vesting program.
#[derive(Clone, Debug, Eq, FromPrimitive, PartialEq)]
pub enum ExampleError {
    InvalidInstruction = 0,

    DataAccountError = 1,

    VerificationFailed = 2,
}

impl From<ExampleError> for ProgramError {
    fn from(e: ExampleError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for ExampleError {
    fn type_of() -> &'static str {
        "ExampleError"
    }
}
