const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex,utf8ToBytes } = require("ethereum-cryptography/utils");

//const privateKey = utf8ToBytes("0fad76a6b07ef8dd6a0bc814b6339d895855881acaf3c1f901c6744368936bb3"); // Replace with your actual private key
const sendAmount = 2;
const balance = 3;
const recipient = "0x9876543210fedcba9876543210fedcba98765432"; // Replace with your actual recipient address
const hashData = recipient + sendAmount + balance;


const privateKey = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
const messageHash = keccak256(utf8ToBytes(hashData));
const signedMessage = secp.secp256k1.sign(messageHash, privateKey);
const signresult = signedMessage;
console.log("Signed Message:", signresult);
