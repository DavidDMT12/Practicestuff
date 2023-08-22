import { useState } from "react";
import server from "./server";
import { createHash } from "crypto"; // Import the crypto module

function Sign({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [hash, setHash] = useState(""); // State for the hash

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
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

      // Create a hash using private key, recipient, and send amount
      const hashData = privateKey + recipient + sendAmount;
      const hashAlgorithm = "sha256"; // You can use a different algorithm if needed
      const hash = createHash(hashAlgorithm).update(hashData).digest("hex");
      setHash(hash);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container signer" onSubmit={transfer}>
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

      {/* Display the calculated hash */}
      <label>
        Hash
        <span>{hash}</span>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Sign;
