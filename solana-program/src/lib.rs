pub use processor::process_instruction;
use solana_program::entrypoint;

pub mod error;
pub mod instructions;
pub mod processor;
pub mod state;
pub mod utils;

entrypoint!(process_instruction);
