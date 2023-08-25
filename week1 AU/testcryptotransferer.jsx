import { useState } from "react";
import server from "./server";
//import { utf8ToBytes, keccak256 } from "ethereum-cryptography/keccak";
//import secp from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privatekey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  //const hashData = recipient + parseInt(sendAmount);
  //const messageHash = keccak256(utf8ToBytes(hashData));
  //const signedMessage = secp.secp256k1.sign(messageHash, privatekey);

  async function transfer(evt) {
    evt.preventDefault();
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        //signedMessage,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key 
        <input
          placeholder="Type your key"
          value={privatekey} 
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
