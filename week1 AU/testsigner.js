const EthCrypto = require('eth-crypto');

const identity = EthCrypto.createIdentity();
const sendAmount = 2;
const recipient = "0x9876543210fedcba9876543210fedcba98765432";


const hashData = recipient + sendAmount;

const messageHash = EthCrypto.hash.keccak256(hashData);
const signature = EthCrypto.sign(identity.privateKey, messageHash);
const publicKey = EthCrypto.recoverPublicKey(signature, messageHash);
const address = EthCrypto.publicKey.toAddress(publicKey);
const check = address === identity.address;




console.log("signature:", signature)
console.log("publickey:", publicKey)
console.log(check)
console.log(identity)
