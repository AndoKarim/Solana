import {Keypair, Connection, PublicKey } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {

    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));
    const mint = new PublicKey("fT1yvHxNkPuwNoNkDbUj6CDxc9cyLhP8jqodZzJeQzP");
    const ata = new PublicKey("AL3edvzHxRhatZTjQeoujJc5v5bJsweMCCc37V3oVMYt");
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