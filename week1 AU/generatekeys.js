const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
    const slicedKey = publicKey.slice(1); // Remove the first byte (prefix)
    const hashedKey = keccak256(slicedKey); // Hash the sliced key
    const hashedKeyBytes = new Uint8Array(hashedKey); // Convert hash to Uint8Array
    const address = hashedKeyBytes.slice(hashedKeyBytes.length - 20); // Take the last 20 bytes

    return address;
}

function generateKeyPair() {
    const privateKey = secp.utils.randomPrivateKey(); // Generate a random private key
    const publicKey = secp.getPublicKey(privateKey, false); // Get the corresponding public key

    const address = getAddress(publicKey);

    // Extract the last 20 bytes of the public key
    const last20Bytes = publicKey.slice(-20);

    return {
        privateKey,
        publicKey,
        address
    };
}

const keys = generateKeyPair();

module.exports = generateKeyPair;
console.log(keys);
