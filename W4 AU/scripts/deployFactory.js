const hre = require("hardhat");

async function main() {
  const FACTORY = await hre.ethers.getContractFactory("EscrowFactory"); //fetching bytecode and ABI
  const EscrowFactory = await FACTORY.deploy(); //creating an instance of our smart contract


  console.log("Deployed contract address:",`${EscrowFactory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});