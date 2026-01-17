require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // Built-in Hardhat network (in-memory)
    hardhat: {},

    // Localhost network (Hardhat node at 127.0.0.1:8545)
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY],
    },

    // Sepolia testnet
    sepolia: {
      url: process.env.RPC_URL,           // e.g. Alchemy/Infura endpoint
      accounts: [process.env.PRIVATE_KEY] // your wallet private key
    },
  },
};
