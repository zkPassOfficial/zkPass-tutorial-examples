# front-end-O1JS-SDK

Next.js 14.0.3 app (`package.json` name `test-01js-sdk-project`). The page to edit is `src/app/page.tsx`. There is no `app/page.tsx` and no `src/app/evm-contract` or `src/app/sol-contract` route in this package. `src/app/layout.tsx` loads Inter with `next/font/google`. `yarn.lock` is the lockfile.

This revision did not install packages or start `next dev`.

## Dependency that is not in this repo

`package.json` depends on `@zkpass/transgate-js-sdk` `^0.2.0` and on `transgate-o1js-sdk` at `file:../../lib`. That relative path points outside `zkPass-tutorial-examples`. This repository does not contain `lib`. `yarn` or `npm install` cannot be assumed to succeed until that directory is present. The home page imports `TransgateZkAppSdk` from `transgate-o1js-sdk/lib`.

`next.config.js` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` to true. `next build` skipping those checks is configuration, not a clean compile result.

## Scripts

From this directory, once `file:../../lib` resolves:

```bash
yarn dev
yarn build
yarn lint
```

## Page behavior

`src/app/page.tsx` stores an app id and schema ids in React state. Replace those prefilled strings with the app and schema for the demo. `start` constructs `new TransgateZkAppSdk(appid)`, calls `isTransgateAvailable`, and alerts `Please install zkPass TransGate` when the connector reports it is unavailable. Each `connector.launch(schemaId)` result is passed to `connector.verifyProof` with `taskId` and `schemaId` converted by `ethers.hexlify(ethers.toUtf8Bytes(...))`, plus `uHash`, `publicFieldsHash`, `validatorSignature`, `validator`, `allocatorSignature`, and `recipient`. The code logs `verifyResult.toBoolean()`. It does not call the Solidity `ProofVerifier` in `../contracts`. `EVMTaskAllocator` in `src/app/constants.ts` is `0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d`.

No extension session, Mina network, or proof result was produced for this revision. There is no GitHub Actions workflow in the parent repository.
