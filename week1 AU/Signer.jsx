import React, { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import secp from "ethereum-cryptography/secp256k1"; // Import the secp module

function Sign({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signedMessage, setSignedMessage] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function generateSignature(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);

      // Create a hash using recipient, send amount, and balance
      const hashData = recipient + sendAmount + balance;
      const hash = keccak256(hashData).digest("hex");

      // Generate a signature using the private key
      const signature = secp.sign(hash, privateKey, { recovered: true });

      setSignedMessage(signature); // Update the state with the generated signature
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container signer" onSubmit={signature}>
      <h1>Sign</h1>

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

      {/* Display the calculated signed message */}
      <label>
        Signed Message
        <span>{signedMessage}</span>
      </label>

      <input type="submit" className="button" value="Signature" />
    </form>
  );
}

export default Sign;
