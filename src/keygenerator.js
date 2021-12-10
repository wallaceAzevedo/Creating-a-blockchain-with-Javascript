//Esta biblioteca nos permitirá gerar uma chave pública e privada
// para instalar essa biblioteca 
//https://www.npmjs.com/package/elliptic
//npm install elliptic ou npm i elliptic
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publickey = key.getPublic('hex');
const privatekey = key.getPrivate('hex');

console.log();
console.log('Private key:', privatekey);

console.log();
console.log('Public key:', publickey);

