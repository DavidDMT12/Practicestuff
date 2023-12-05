const { Select } = require('enquirer');
const readline = require('readline');
const EthCrypto = require('eth-crypto');
const { Hash } = require('crypto');

const prompt = new Select({
  name: 'choice',
  message: 'Would you like to create an address or sign a message?',
  choices: [
    { name: 'Create an address' },
    { name: 'Sign a message' },
  ],
});

prompt.run()
  .then(async (answer) => {
    if (answer === 'Create an address') {
      const identity = EthCrypto.createIdentity();
      console.log('New identity created:');
      console.log(identity);
    } else if (answer === 'Sign a message') {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Please input the private key: ', (identity) => {
        rl.question('Please input the amount to send (e.g., 10): ', (sendAmount) => {
          rl.question("Please input the recipient's address: ", (recipient) => {
            rl.close();

            // Convert the sendAmount to a number
            sendAmount = parseInt(sendAmount);

            // Call the function with the provided inputs
            createTransaction(identity, sendAmount, recipient);
          });
        });
      });
    }
  })
  .catch(console.error);

function createTransaction(identity, sendAmount, recipient) {
  const hashData = recipient + sendAmount;
  const messageHash = EthCrypto.hash.keccak256(hashData);
  const signature = EthCrypto.sign(identity, messageHash);
  const publicKey = EthCrypto.recoverPublicKey(signature, messageHash);
  const address = EthCrypto.publicKey.toAddress(publicKey);

  console.log('Signature:', signature);
  console.log('Your Address:', address);
  console.log('Recipient Address:', recipient);
  console.log('Amount to send:', sendAmount);
  console.log('Message:', hashData);
  console.log('Hash:', messageHash);

}

