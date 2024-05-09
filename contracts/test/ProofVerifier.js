const { Web3 } = require('web3');
const web3js = new Web3();

const { expect } = require("chai");

describe("ProveVerifier test", function () {
  let pvContract;
  this.timeout(100000);

  before(async () => {
    const pv = await ethers.getContractFactory("ProofVerifier");
    pvContract = await pv.deploy();
  });

  it("ProveVerifier verify proof", async () => {
    const proof = {
      taskId: web3js.utils.asciiToHex("6aee64a8790e4a5dae19846075ad6078"),
      schemaId: web3js.utils.asciiToHex("c7eab8b7d7e44b05b41b613fe548edf5"),
      uHash: "0xa3a5c8c3dd7dfe4abc91433fb9ad3de08344578713070983c905123b7ea91dda",
      publicFieldsHash: "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6",
      validator: "0xb1C4C1E1Cdd5Cf69E27A3A08C8f51145c2E12C6a",
      allocatorSignature: "0xd367d806e2d7a29a9eb4192eaa759888ad873ed4f8bb3cd8a91beaaa7e1ef770114dc1052ea3dfb96378c576969021eb43b37d00e7deb15e31b277ef42522e8a1c",
      validatorSignature: "0xe8ae8ff9ddc5f4009c2d8bf6b1ccb284af8e5072889cf0c55cca3ece008a92cc680922aaba03758eb773526836a6ac98db752d0b1e65dc0b8f3f8912c47e524c1c",
    }

    const res = await pvContract.verify(proof);

    expect(res).to.equal(true);
  });
});
