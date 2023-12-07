import { Transaction, Keypair, SystemProgram, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));

    const swapAuthority = new PublicKey("6mdBnge75QoPevJjjbR6zSQnKTDmCw6GL8v1X5H31xRo");
    const poolTokenMint = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/poolTokenMint.json").toString()) as number[]));
    const tokenAccountPool = Keypair.generate();
    const poolAccountRent = await token.getMinimumBalanceForRentExemptAccount(connection);
    const createTokenAccountPoolInstruction = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: tokenAccountPool.publicKey,
        space: token.ACCOUNT_SIZE,
        lamports: poolAccountRent,
        programId: token.TOKEN_PROGRAM_ID,
    });
    const initializeTokenAccountPoolInstruction = token.createInitializeAccountInstruction(
        tokenAccountPool.publicKey,
        poolTokenMint.publicKey,
        wallet.publicKey
    )
    const tx3 = new Transaction().add(createTokenAccountPoolInstruction, initializeTokenAccountPoolInstruction);
    await sendAndConfirmTransaction(connection, tx3, [wallet, tokenAccountPool]);

    console.log(tokenAccountPool);

}

main();