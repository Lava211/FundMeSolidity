const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

require("hardhat-deploy");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;

    if (developmentChains.includes(network.name)) {
        const mockV3Aggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = mockV3Aggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    console.log("ethUsdPriceFeedAddress ; " + ethUsdPriceFeedAddress);
    console.log("chainId ; " + chainId);
    const args = [ethUsdPriceFeedAddress];
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("--------------------01-deploy-Done------------------------");

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundme.address, args);
    }
};

module.exports.tags = ["all", "fundme"];

//start 11:09
