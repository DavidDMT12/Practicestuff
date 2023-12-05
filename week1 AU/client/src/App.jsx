import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";

function App() {
  const [balance, setBalance] = useState(0);

  const [account, setAccount] = useState('Not connected');

  useEffect(() => {
    const template = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          setShowNoWalletMessage(true);
          return;
        }
  
        const accounts = await ethereum.request({
          method: "eth_requestAccounts"
        });
  
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
  
        const address = accounts[0]; // Get the first account from the returned array
        const account = ethers.getAddress(address)
        setAccount(account); // Update the account state
      } catch (error) {
        console.error(error);
        setShowNoWalletMessage(true);
      }
    };
  
    template();
  }, []);

  return (
    <div>
      <div>
            <h1>Wallet App</h1>
            <p className="account-info">
              <small>Connected Account - {account}</small>
            </p>
          </div>
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        account={account}
      />
      <Transfer 
      setBalance={setBalance} 
      account={account}/>
    </div>
    </div>
    
  );
}

export default App;
