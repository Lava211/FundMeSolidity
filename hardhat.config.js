/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
    //solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },

    defaultNetwork: "hardhat",
    networks: {
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
        },
        polygon: {
            url: "",
            chainId: 137,
        },
    },
    gasReporter: {
        enabled: process.env.COINMARKETCAP_API_KEY ? true : false,
        currency: "USD",
        token: "ETH",
        coinmarketcap: COINMARKETCAP_API_KEY,
        noColors: true,
        outputFile: "gasReporter.txt",
    },
    etherscan: { apiKey: ETHERSCAN_API_KEY },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};
