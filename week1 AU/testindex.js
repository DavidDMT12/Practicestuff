const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const EthCrypto = require('eth-crypto');

app.use(cors());
app.use(express.json());

const balances = {
  "0x7227BDdbEB0D43ab8Fd79A954E04c3f43420E70D": 100, // 0x4cfe2f5f73207984d89cb500ac08cdf1d3d930d4158d73260ffdfc26b7c4dbd5 / 2b11ccc0902fe3453ca1103ff20fcb973a17caac942cfb5f979766202a5ae67cd7d58eef8fa73f295cff4f6e4d3c3bb1be6568453fa1502d48a1858b83cbb62f
  "0x0236810fCb10EB0f31eFb64849CFFAC9167a8dc1": 50, // 0x82f56f0c278ef2899590599162e212715b5de12dcbca9acda0a3e01be730edbb / 6f08406bba9856f63456e98e08b5f6079c461f2712ce424a252d5b50d8faa53b428cc9824cfa8204bff255b992f9c73f2c6068668cc80f79632cc5c0ef16e419
  "0x6029C1b5eeAd3Bf20654bad05D3e6f38b87FB3DD": 75, // 0x699b788eb37ab12f486923539749c5531215e7319f9389e3c9e51d9ee5cce73b / 9808bc510bb945850cdee0a1a8cae05bf13da7a3a7eff1212f4aebf4cc84bf1a7dd2d8d5748998549c3d4abba916de62e0f8f5f08fc274c625e62675bdc9252f
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const hashData = recipient + amount;

  const messageHash = EthCrypto.hash.keccak256(hashData);
  const publicKey = EthCrypto.recoverPublicKey(signature, messageHash);
  const address = EthCrypto.publicKey.toAddress(publicKey);
  const check = sender === address;
  if (check == false) {
    res.status(400).send({ message: "Wrong signature" });
  }
  else{
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  } }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
