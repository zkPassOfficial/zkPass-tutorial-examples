# front-end-JS-SDK

Next.js 14.0.3 app (`next` `14.0.3` in `package.json`, package name `test-sdk-project`). The home page is `src/app/page.tsx`, not `app/page.tsx`. `src/app/layout.tsx` loads Inter through `next/font/google`. `yarn.lock` is the lockfile in this directory. Scripts are `dev` (`next dev`), `build` (`next build`), `start` (`next start`), and `lint` (`next lint`).

This revision did not run `npm install`, `yarn`, or `next dev`, and it did not open a browser.

## Scripts

From this directory, after installing dependencies with the lockfile:

```bash
yarn dev
yarn build
yarn lint
```

`next.config.js` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` to true, and `images.domains` to `backend.zkpass.org`. A finished `next build` therefore does not mean TypeScript or ESLint reported a clean tree. There is no Vercel project file and no GitHub Actions workflow in this repository.

## What the pages do

`src/app/page.tsx` builds `TransgateConnect` from `@zkpass/transgate-js-sdk` with the app id in the form, calls `isTransgateAvailable`, and alerts `Please install zkPass TransGate` when that returns false. `Start Single Schema` calls `connector.launch` once. `Start multi-schemas` shifts two schema ids and launches them in order. Each result is passed to `verifyEVMMessageSignature` in `src/app/helper.ts`. The prefilled app id and schema id strings are React state in that file. Replace them with the app and schema registered for the demo. This page does not submit a chain transaction.

`src/app/evm-contract/page.tsx` also uses `TransgateConnect.launch`, then encodes `attest` with `AttestationABI.json` and `ethers.Contract` against the address `0x8c18c0436A8d6ea44C87Bf5853F8D11B55CF0302` hardcoded in that file. `src/app/sol-contract/page.tsx` calls `verifySolanaMessageSignature`. Allocator checks in `helper.ts` compare recovered signers with `EVMTaskAllocator` and `SolanaTaskAllocator` from `src/app/constants.ts`. `EVMTaskAllocator` is `0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d`, the same address as `defaultAllocator` in `contracts/contracts/ProofVerifier.sol`. Refer to the Solana value by the constant name `SolanaTaskAllocator` in `constants.ts`. It is a 32-byte id, not an environment variable in this package.

`verifyEVMMessageSignature` and `verifySolanaMessageSignature` are local signature checks. They are not a call to `ProofVerifier.verify` and they were not executed here.

The extension, the wallet, and any network named in the page must be present on the machine that runs the demo. This repository does not record a successful proof or a transaction hash.
