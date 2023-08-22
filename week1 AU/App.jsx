import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Signer from "./Signer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />

      <div className="signer">
      <Signer setBalance={setBalance} address={address} />
      </div>
    </div>
  );
}

export default App;
