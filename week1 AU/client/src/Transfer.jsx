import { useState } from "react";
import server from "./server";


function Transfer({ setBalance , account }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signedMessage, setSignedMessage] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const handlePersonalSign = async () => {
    try {
      const from = account;
      const message = recipient + sendAmount;
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const msg = Array.prototype.map.call(data, (x) => ('00' + x.toString(16)).slice(-2)).join('');
      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from],
      });
      console.log("inside", sign);
      setSignedMessage(sign); // Update signed message in state
      console.log("signed inside", sign);

      // Perform the server.post call here after setting the signed message
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: account,
          amount: parseInt(sendAmount),
          recipient,
          sign: sign, // Use the retrieved sign
        });
        setBalance(balance);
      } catch (ex) {
        alert(ex.response.data.message);
      }
    } catch (err) {
      console.error(err);
      // Handle error here
    }
  };

  const transfer = async (evt) => {
    evt.preventDefault();
    await handlePersonalSign(); // Wait for handlePersonalSign to complete
  };


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

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
