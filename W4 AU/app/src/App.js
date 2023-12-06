import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import abi from './artifacts/contracts/Escrow.sol/Escrow';
import Escrow from './Escrow';
import deploy from './deploy';
import EscrowFactory from './artifacts/contracts/EscrowFactory.sol/EscrowFactory';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

const handleApprove = async (escrowContract, signer) => {
  escrowContract.on('Approved', () => {
    document.getElementById(escrowContract.address).className = 'complete';
    document.getElementById(escrowContract.address).innerText = "✓ It's been approved!";
  });
  await approve(escrowContract, signer);
};

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    async function populateEscrows() {
      const FactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contract = new ethers.Contract(FactoryAddress, EscrowFactory.abi, signer);
      const counter = await contract.getDeployedContractsCount();  
      const countuint = counter.toNumber();  
      console.log(countuint);
  
      const newEscrows = []; // Temporary array to accumulate escrows
  
      for (let i = 0; i < countuint; i++) {
        const factory = await contract.deployedContracts(i);
        const escrowContract = new ethers.Contract(factory.escrowAddress, abi.abi, signer);
    
        const isApproved = await escrowContract.isApproved(); 
    
        const escrow = {
          address: escrowContract.address,
          arbiter: await factory.arbiter,
          beneficiary: await factory.beneficiary,
          value: (await escrowContract.value()).toString(),
          isAlreadyApproved: isApproved, // Flag to check if already approved
          handleApprove: async () => {
            await handleApprove(escrowContract, signer);
          },
        };

        newEscrows.push(escrow);
      }
    
      setEscrows(newEscrows);
      setSigner(signer);
    }
  
    populateEscrows();
  }, []);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const valueeth = ethers.BigNumber.from(document.getElementById('eth').value);
    const value = ethers.utils.parseEther(valueeth.toString());
    const deployment = await deploy(signer, arbiter, beneficiary, value);
    const escrowContract = new ethers.Contract(deployment.escrowAddress, abi.abi, signer);


    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: valueeth.toString(),
      handleApprove: async () => {
        await handleApprove(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} isAlreadyApproved={escrow.isAlreadyApproved}/>;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
