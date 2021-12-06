const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddres, ToAddres, amount){
        this.fromAddres = fromAddres;
        this.ToAddres = ToAddres;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddres + this.ToAddres + this.amount).toString();
    }

    sigTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddres){
            throw new Error('You cannot sign transactions for other wallets!')
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }
    
    isValid(){

        //verificará primeiro se o endereço de é nulo
        if(this.fromAddres === null) return true;
        

        // verificará se existe uma assinatura
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transactions');
        }

        //verifique se esta transação foi realmente assinada por aquela chave
        const publickey = ec.keyFromPublic(this.fromAddres, 'hex');
        return publickey.verify(this.calculateHash(), this.signature);
    }
}
class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0;
        // ele irá calcular o hash do nosso bloco
        this.hash = this.calculateHash();
       
    }

    //metodo para calauclar a hash do bloco
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    //calcular o hash de todos os blocos. E entar em uma corrente válida.
    // loop que fará  a execução continuar até que nosso hash comece com zeros suficientes.
    minedBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(" Block mined: " + this.hash);
    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
          if (!tx.isValid()) {
            return false;
          }
        }

        return true;
    }
}

// será o responsavel por inicializar o nosso blockchain
class Blockchain{
    constructor(){
        this.chain = [this.creatingGenesisBlock()];
        // dificulty dira quantos zeros o bloco começará
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 200;
    }

    // ira rertornar um novo bloco criado
    creatingGenesisBlock(){
        // introduzir um / index, data, um nome , hash do bloco anterios (este bloco é o primeiro bloco então ele não pode apontar para nenhum bloco anterior então começará com 0 );
        return new Block("01/01/2021", "Genesis Block", "0")
    }

    //retornara o ultimo bloco criado
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }
    
    minePendingTransactions(miningRewardAnddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.minedBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAnddress, this.miningReward)
        ];
    }

    addTransaction(transaction){
        if(!transaction.fromAddres || !transaction.ToAddres){
            throw new Error('Transaction must include from and to addres');
        }
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBallanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddres === address){
                    balance -= trans.amount;
                }

                if(trans.ToAddres === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    // Metodo para validar um bloco retornará true se for tudo bem se não retornara false se tiver dado algo errado
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            // verificar se a hash do block está validada
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
              }

            //verificar se bloco aponta para um anterior correto.se o nosso bloco atual tem um hash anterior que não é igual ao hash do nosso bloco anterior e se for esse o caso então novamente sabemos que algo está errado porque o nosso bloco atual não aponta para o bloco anterior.
            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
              }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;