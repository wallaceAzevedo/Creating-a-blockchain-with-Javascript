const SHA256 = require('crypto-js/sha256')

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        // ele irá calcular o hash do nosso bloco
        this.hash = this.calculateHash();
    }

    //metodo para calauclar a hash do bloco
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// será o responsavel por inicializar o nosso blockchain
class Blockchain{
    constructor(){
        this.chain = [this.creatingGenesisBlock()];
    }

    // ira rertornar um novo bloco criado
    creatingGenesisBlock(){
        // introduzir um / index, data, um nome , hash do bloco anterios (este bloco é o primeiro bloco então ele não pode apontar para nenhum bloco anterior então começará com 0 );
        return new Block(0, "01/01/2021", "Genesis Block", "0")
    }

    //retornara o ultimo bloco criado
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }
    // metodo responsavel por criar novos blocos
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    // Metodo para validar um bloco retornará true se for tudo bem se não retornara false se tiver dado algo errado
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i -1];

            // verificar se a hash do block está validada
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            //verificar se bloco aponta para um anterior correto.se o nosso bloco atual tem um hash anterior que não é igual ao hash do nosso bloco anterior e se for esse o caso então novamente sabemos que algo está errado porque o nosso bloco atual não aponta para o bloco anterior.
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let savjeeCoin = new Blockchain();
savjeeCoin.addBlock(new Block(1, "03/01/2021", { amount: 4 }));
savjeeCoin.addBlock(new Block(2, "13/01/2021", { amount: 10 }));

console.log('Is blockchain valid ? ' + savjeeCoin.isChainValid());

// tentando modificar a quantidade enviada após o bloco 1 ser criado, retornara falso pois apos ser criado o bloco n pode ser modificado.
savjeeCoin.chain[1].data = {amount : 100};

// tentando modificar a hash do bloco após o bloco 1 ser criado. retornara falso pois apos ser criado o bloco n pode ser modificado.
savjeeCoin.chain[1].data = savjeeCoin.chain[1].calculateHash();

console.log('Is blockchain valid ? ' + savjeeCoin.isChainValid());

//console.log(JSON.stringify(savjeeCoin, null, 4));