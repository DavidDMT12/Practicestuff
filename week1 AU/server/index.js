const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { ethers } = require("ethers");

app.use(cors());
app.use(express.json());

const balances = {
  
};

app.get("/balance/:account", (req, res) => {
  const { account } = req.params;
  const balance = balances[account] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, sign } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  console.log(sign);

const message = recipient + amount;
const signer = sign;
console.log(signer);
const senderAddress = ethers.verifyMessage(message, signer);
console.log(senderAddress);
const check = senderAddress === sender;
console.log(check);

  if (check === false) {
    res.status(400).send({ message: "Incorrect signature" });
  } else {
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    console.log(sender, recipient, amount, sign);
    res.send({ balance: balances[sender] });
  }
}
});

app.post("/faucet", (req, res) => {
  const { sender } = req.body;

 faucet(sender);
 res.send({ balance: balances[sender] });

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(account) {
  if (!balances[account]) {
    balances[account] = 0;
  }
}

function faucet(account) {
  if (!balances[account]) {
    balances[account] = 100;
  } else {
    balances[account] +=100;
  }
}
