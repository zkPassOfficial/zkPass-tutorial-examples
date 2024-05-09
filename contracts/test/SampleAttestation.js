const { expect } = require("chai");

describe("SampleAttestation test", function () {
  let saContract;
  this.timeout(100000);

  before(async () => {
    const sa = await ethers.getContractFactory("SampleAttestation");
    saContract = await sa.deploy();
  });

  it("SampleAttestation attest", async () => {
    const proof = {
      taskId: web3.utils.asciiToHex("b16f527b8891454abe684c6a5f06dfb2"),
      schemaId: web3.utils.asciiToHex("c7eab8b7d7e44b05b41b613fe548edf5"),
      uHash: "0xa3a5c8c3dd7dfe4abc91433fb9ad3de08344578713070983c905123b7ea91dda",
      publicFieldsHash: "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6",
      recipient: "0xeCD12972E428a8256c9805b708E007882568d7D6",
      validator: "0xb1C4C1E1Cdd5Cf69E27A3A08C8f51145c2E12C6a",
      allocatorSignature: "0x8e789c4c4805d256ec9d332e734888d83dee9126030bd00a52a0d3342c3cc40613f88f8d3145360e5464b908fd82e94814a2f0549a459ac26489e76e1a89bd261b",
      validatorSignature: "0x5e47b2237c7208317f36a10039a37f637f33564138458770f87cd1880a45a2580052763accdd97f33a090523fd9220ed31f6ebabbfd51b263635e16fb0a0399a1b",
    };

    await saContract.attest(proof);

    const uid = "0x67c01a3e12ab8d66a38f66ca936b56cf53819fb269b6a41d9cb338f9b7aa763d";
    const res = await saContract.getAttestation(uid);

    expect(res).to.deep.equal([
      uid,
      proof.schemaId,
      proof.uHash,
      proof.recipient,
      proof.publicFieldsHash
    ]);
  });
});
