import server from "./server";
import React, { useEffect } from 'react';

function Wallet({ balance, setBalance, account }) {
  async function fetchBalanceForAccount(account) {
    if (account) {
      try {
        const { data: { balance: fetchedBalance } } = await server.get(`balance/${account}`);
        setBalance(fetchedBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0); // Set balance to 0 in case of an error
      }
    } else {
      setBalance(0);
    }
  }

  // Fetch balance when the 'account' prop changes
  useEffect(() => {
    fetchBalanceForAccount(account);
  }, [account, setBalance]);

  async function faucet() {
    try {
      const response = await server.post(`faucet`, {
        sender: account,
      });
      setBalance(response.data.balance);
      // Fetch updated balance after faucet operation
      fetchBalanceForAccount(account);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <div className="balance">Balance for account {account}: {balance}</div>
      <button className="button" onClick={faucet}>Faucet</button>
      
    </div>
  );
}

export default Wallet;
