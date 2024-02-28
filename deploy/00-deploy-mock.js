require("hardhat-deploy");
const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;

    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        const MockV3Aggregator = await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        });
        console.log("network found + network.name" + network.name);
    }
    log("--------------------00-deploy-Done------------------------");
};

module.exports.tags = ["all", "mocks"];
