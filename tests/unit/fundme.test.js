const { assert, expect } = require("chai");
const { deployments, network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundme;
          let deployer;
          let mockV3Aggregator;
          let lessAmountToBeSend = ethers.utils.parseUnits("1", "gwei");
          let EnoughAmountToBeSend = ethers.utils.parseUnits("1", "ether");
          beforeEach(async function () {
              await deployments.fixture(["all"]);
              deployer = (await getNamedAccounts()).deployer;
              fundme = await ethers.getContract("FundMe", deployer);
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              );
          });
          describe("constructor", async function () {
              it("set aggregator in constructor", async function () {
                  const result_mockV3Aggregator = await fundme.priceFeed();
                  console.log(
                      "result_mockV3Aggregator " +
                          result_mockV3Aggregator +
                          " mockV3Aggregator " +
                          mockV3Aggregator.address
                  );
                  assert(result_mockV3Aggregator, mockV3Aggregator.address);
              });
          });
          describe("fund", async function () {
              it("transaction on zero amount send", async function () {
                  await expect(fundme.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  );
              });
              it("transaction on less amount send", async function () {
                  await expect(
                      fundme.fund({ value: lessAmountToBeSend })
                  ).to.be.revertedWith("You need to spend more ETH!");
              });
              it("transaction on enough amount send when big nuymbers compare", async function () {
                  await fundme.fund({ value: EnoughAmountToBeSend });
                  const response = await fundme.addressToAmountFunded(deployer);
                  assert(response, EnoughAmountToBeSend);
              });
              it("transaction on enough amount send when strings compare", async function () {
                  await fundme.fund({ value: EnoughAmountToBeSend });
                  const response = await fundme.addressToAmountFunded(deployer);
                  assert(response.toString(), EnoughAmountToBeSend.toString());
              });
              it("check if deployer is pushed to funders or not", async function () {
                  await fundme.fund({ value: EnoughAmountToBeSend });
                  const funderZero = await fundme.funders(0);
                  assert(funderZero, deployer);
              });
          });
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundme.fund({ value: EnoughAmountToBeSend });
              });
              it("withdraw ", async function () {
                  const startingContractBalance =
                      await fundme.provider.getBalance(fundme.address);
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  const transactionResponse = await fundme.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);
                  const endingContractBalance =
                      await fundme.provider.getBalance(fundme.address);
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  assert(endingContractBalance, 0);
                  assert(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost)
                  );
              });

              it("withdraw for multiple funders  ", async function () {
                  const accounts = await ethers.getSigners();

                  for (let i = 1; i < 8; i++) {
                      const fundMeConnect = await fundme.connect(accounts[i]);
                      await fundMeConnect.fund({
                          value: EnoughAmountToBeSend,
                      });
                  }

                  const startingContractBalance =
                      await fundme.provider.getBalance(fundme.address);
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  const transactionResponse = await fundme.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);
                  const endingContractBalance =
                      await fundme.provider.getBalance(fundme.address);

                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  await expect(fundme.funders(0)).to.be.reverted;

                  assert(endingContractBalance, 0);

                  assert(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost)
                  );

                  for (let i = 0; i < 8; i++) {
                      assert(
                          await fundme.addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      );
                  }
              });

              it("onlyOwner can withdraw", async function () {
                  const accounts = await ethers.getSigners();
                  const attackerAccount = accounts[1];
                  const attackerConnectToFuncMe = await fundme.connect(
                      attackerAccount.address
                  );

                  await expect(attackerConnectToFuncMe.withdraw()).to.be
                      .reverted;
              });

              it("cheaper withdraw ", async function () {
                  const startingContractBalance =
                      await fundme.provider.getBalance(fundme.address);
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  const transactionResponse = await fundme.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);
                  const endingContractBalance =
                      await fundme.provider.getBalance(fundme.address);
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  assert(endingContractBalance, 0);
                  assert(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost)
                  );
              });

              it("cheaperWithdraw for multiple funders  ", async function () {
                  const accounts = await ethers.getSigners();

                  for (let i = 1; i < 8; i++) {
                      const fundMeConnect = await fundme.connect(accounts[i]);
                      await fundMeConnect.fund({
                          value: EnoughAmountToBeSend,
                      });
                  }

                  const startingContractBalance =
                      await fundme.provider.getBalance(fundme.address);
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  const transactionResponse = await fundme.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);
                  const endingContractBalance =
                      await fundme.provider.getBalance(fundme.address);

                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer);

                  await expect(fundme.funders(0)).to.be.reverted;

                  assert(endingContractBalance, 0);

                  assert(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost)
                  );

                  for (let i = 0; i < 8; i++) {
                      assert(
                          await fundme.addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      );
                  }
              });
          });
      });

//12:11:45
