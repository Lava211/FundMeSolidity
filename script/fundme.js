const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundme = await ethers.getContract("FundMe");

    console.log("funding .....");
    await fundme.fund({ value: ethers.utils.parseEther("0.1") });
    console.log("done .....");
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
