const { assert, expect } = require("chai");
const { deployments, network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundme;
          let deployer;
          let lessAmountToBeSend = ethers.utils.parseUnits("1", "gwei");
          let EnoughAmountToBeSend = ethers.utils.parseUnits("1", "ether");
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              fundme = await ethers.getContract("FundMe", deployer);
          });

          it("check fund and withdraw", async function () {
              await fundme.fund({ value: EnoughAmountToBeSend });
              await fundme.withdraw();

              const endingBalance = await ethers.provider.getBalance(
                  fundme.address
              );
              assert(endingBalance.toString(), "0");
          });
      });
