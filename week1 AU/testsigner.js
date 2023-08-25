const secp = require("ethereum-cryptography/secp256k1");
//import * as secp from '@noble/secp256k1';
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = "744e482805445f21f27bf1edefcb4f82ef7cfd2b26dd149c19eb3465c6738646";
const sendAmount = 2;
const recipient = "0x9876543210fedcba9876543210fedcba98765432";


const hashData = recipient + sendAmount;

const messageHash = keccak256(utf8ToBytes(hashData));
const signedMessage = secp.secp256k1.sign(messageHash, privateKey, { extraEntropy: true });

const publicKey = toHex(signedMessage.recoverPublicKey(messageHash).toRawBytes());
const valid = secp.secp256k1.verify(signedMessage, messageHash, publicKey) === true;

console.log("signature:", signedMessage)
console.log("publickey:", publicKey)
console.log("isValid:", valid)
