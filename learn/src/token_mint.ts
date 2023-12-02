import { createAccount, createMint, mintTo, getAssociatedTokenAddressSync, transfer, burn } from "@solana/spl-token"
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
    const mint = tokenKeypair.publicKey;
    const ta = tokenAccKeypair.publicKey;

    const decimals = 9;
    
    // const tokenMintAddress = await createMint(connection, payer, payer.publicKey, payer.publicKey, 9, tokenKeypair);
    // console.log(tokenMintAddress.toBase58())

    // const ta = await createAccount(connection, payer, tokenKeypair.publicKey, payer.publicKey);
    // console.log(ta.toBase58());

    const ata = getAssociatedTokenAddressSync(tokenKeypair.publicKey, payer.publicKey);

    // const amount = 3*10**decimals;
    // const sigx = await mintTo(connection, payer, mint, ata, payer.publicKey, amount)
    // console.log(sigx)

    // const sigx = await transfer(connection, payer, ata, ta, payer.publicKey, 10**9)
    // console.log(sigx)

    const sigx = await burn(connection, payer, ata, mint, payer.publicKey, 10**9)
    console.log(sigx)
}

main();