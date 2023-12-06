import { ethers } from 'ethers';
import EscrowFactory from './artifacts/contracts/EscrowFactory.sol/EscrowFactory';


export default async function deploy(signer, arbiter, beneficiary, value) {
  const FactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const contract = new ethers.Contract(FactoryAddress, EscrowFactory.abi, signer);
  console.log(contract);
  const createTx = await contract.createEscrow(arbiter, beneficiary, { value });
  await createTx.wait();
  const count2 = await contract.getDeployedContractsCount();
  console.log(count2.toNumber()); 

  const counter = await contract.getDeployedContractsCount();  

  const countuint = counter.toNumber()-1;  
  console.log(countuint);
  const factory = await contract.deployedContracts(countuint);
  console.log(factory);
  return factory;
}
