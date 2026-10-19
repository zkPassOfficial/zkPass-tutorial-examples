# zkPass tutorial examples

Samples for the zkPass Transgate flow: two Next.js front ends, JSON schema examples, a Hardhat contract package, and a Solana program. Product background is on the zkPass docs site: [zkpass.gitbook.io/zkpass](https://zkpass.gitbook.io/zkpass). This revision did not install dependencies, start a server, or send a transaction.

## Layout

- [front-end-JS-SDK](front-end-JS-SDK/README.md) — Next.js app using `@zkpass/transgate-js-sdk` `^0.4.0`. Pages live under `src/app/`, including EVM and Solana contract demos.
- [front-end-O1JS-SDK](front-end-O1JS-SDK/README.md) — Next.js app using `TransgateZkAppSdk` from `transgate-o1js-sdk`. The package is `file:../../lib`, which is outside this repository.
- [schemas](schemas) — JSON examples (`binance-balance.json`, `discord-channel.json`, `discord-owner.json`, `okx-kyc.json`, `quora-account.json`, `x-account.json`). They are data files, not a program.
- [contracts](contracts/README.md) — Solidity `ProofVerifier` and `SampleAttestation` with Hardhat tests.
- [solana-program](solana-program/README.md) — Rust program crate `example` on `solana-program` `1.18.11`.

## License

Apache License, Version 2.0. See [LICENSE](LICENSE).
