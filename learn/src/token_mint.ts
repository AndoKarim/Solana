import { createAccount, createMint } from "@solana/spl-token"
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
const fs = require("fs")

async function main() {

    const connection = new Connection(clusterApiUrl("devnet"));

    const secret = JSON.parse(fs.readFileSync("AaaipcFKbS8LJkR9t7kHwqJRL5Q8gdQe5nYxd6mMucbf.json").toString()) as number[]
    const secretKey = Uint8Array.from(secret)
    const payer = Keypair.fromSecretKey(secretKey)

    const secretTok = JSON.parse(fs.readFileSync("Tk2cW1WpQzcUe1duJkzvTvdmk9foxJrsEbMw3CGKcAg.json").toString()) as number[]
    const secretKeyTok = Uint8Array.from(secretTok)
    const tokenKeypair = Keypair.fromSecretKey(secretKeyTok)

    const secretTokAcc = JSON.parse(fs.readFileSync("ToAQVgJopqURyYXoWaN6DB7hQXdo8hc5PPHkdZSRULd.json").toString()) as number[]
    const secretKeyTokAcc = Uint8Array.from(secretTokAcc)
    const tokenAccKeypair = Keypair.fromSecretKey(secretKeyTokAcc)
    
    //const tokenMintAddress = await createMint(connection, payer, payer.publicKey, payer.publicKey, 9, tokenKeypair);
    //console.log(tokenMintAddress.toBase58())

    const ta = await createAccount(connection, payer, tokenKeypair.publicKey, payer.publicKey, tokenAccKeypair);
    console.log(ta.toBase58());
}

main();