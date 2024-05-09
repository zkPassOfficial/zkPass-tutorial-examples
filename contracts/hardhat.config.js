require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [""]
    }
  }
};
