# Tutorial Solana program

Rust crate `example` (`Cargo.toml` edition `2021`) for a zkPass attestation instruction. `[lib]` sets `crate-type` to `cdylib` and `lib`. Dependencies include `solana-program` `1.18.11`, `borsh` `1.4.0`, and `solana-program-test` `1.18.11` as a dev-dependency. `src/lib.rs` exports `process_instruction` with `entrypoint!(process_instruction)`.

`process_instruction` in `src/processor.rs` deserializes `ExampleInstruction`. The only variant handled here is `ExampleInstruction::Attest`, which calls `attest`.

This revision did not run `cargo build` or `cargo test`, and it did not contact a Solana cluster.

## Commands

From this directory, with a Rust toolchain that can build Solana program crates:

```bash
cargo build
cargo test
```

## Tests are not feature-gated

`tests/functional.rs` begins with a commented attribute: `// #![cfg(feature = "test-bpf")]`. The active test is `#[tokio::test] async fn test()`. `Cargo.toml` defines a feature named `test-sbf`, not `test-bpf`, and nothing in the test file enables `test-sbf`. Do not describe `cargo test` as skipped because a feature is missing. The commented line would not have matched `test-sbf` even if it were uncommented.

The test builds a `ProgramTest` named `example` and uses `solana_program_test`. That is an in-process banks client. It is not a devnet or mainnet transaction, and this revision did not run it. The test embeds signature and hash literals. Those values stay in the test source. They are not repeated here.
