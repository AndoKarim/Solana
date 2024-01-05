import { Transaction, Keypair, SystemProgram, Connection, PublicKey, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));
    // let txhash = await token.setAuthority(
    //     connection, // connection
    //     wallet, // payer
    //     new PublicKey("7NwC5SquuENnx4UyTKJUN6mGPAr3eYDBReRwoedQpgx"), // mint account || token account
    //     wallet, // current authority
    //     token.AuthorityType.FreezeAccount, // authority type
    //     null // new authority
    // );

    // USE token.revoke()
}

main();