require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    goerli: {
      chainId: 5,
      url: "https://ethereum-goerli.publicnode.com",
      accounts: [""]
    }
  }
};
