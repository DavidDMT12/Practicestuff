const secp = require("ethereum-cryptography/secp256k1");
//import * as secp from '@noble/secp256k1';
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signedMessage } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const hashData = recipient + amount;

  const messageHash = keccak256(utf8ToBytes(hashData));
  const publicKey = toHex(signedMessage.recoverPublicKey(messageHash).toRawBytes());
  const valid = secp.secp256k1.verify(signedMessage, messageHash, publicKey) === true;
  require(isValid);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 10;
  }
}
