import {Keypair, Connection, PublicKey } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {

    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("/home/quarch/solana/turbo_raydium/main/src/wallet.json").toString()) as number[]));
    const mint = new PublicKey("G8Q5ygi38AqgGaawGKMgMoux75M4fL6wApecQRdfeoTT");
    const ata = new PublicKey("3eF7W436ZCCqirfz5SGEoXrLZtaXodFowSKVvysariLo");
    const amount = 1000;
    const decimals = 9;
    await token.mintToChecked(
        connection, // connection
        wallet, // fee payer
        mint, // mint
        ata, // receiver (ata)
        wallet, // mint authority
        amount * 10 ** decimals, // amount
        decimals // decimals
    );

}

main();