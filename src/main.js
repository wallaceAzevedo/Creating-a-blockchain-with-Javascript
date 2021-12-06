const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


// Sua chave privada vai aqui
const myKey = ec.keyFromPrivate('44ac7792f87071225c07bdb1f48cc91e123f2a117be071fd413fd13499687dae');

// A partir daí, podemos calcular sua chave pública (que também funciona como o endereço de sua carteira)
const myWalletAddress = myKey.getPublic('hex')

// Cria uma nova instância da classe Blockchain
let savjeeCoin = new Blockchain();

//Cria uma transação e assina com sua chave
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.sigTransaction(myKey);
savjeeCoin.addTransaction(tx1)

console.log('\n Starting the miner...');
savjeeCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of wallace is', savjeeCoin.getBallanceOfAddress(myWalletAddress));

console.log('Is chain valid?', savjeeCoin.isChainValid());