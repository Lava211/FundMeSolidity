const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
    console.log("verify calling");
    try {
        console.log("contractAddress " + contractAddress + " args " + args);
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Verified Success---");
        } else {
            console.log("Verification fail---" + error);
        }
    }
};

module.exports = { verify };
