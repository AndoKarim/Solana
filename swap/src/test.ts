import { Transaction, Keypair, SystemProgram, Connection, PublicKey, Account, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout, CurveType } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
const fs = require("fs");

// const keypair = Keypair.fromSecretKey(bs58.decode(""));
// console.log(keypair);

async function buildCreateAssociatedTokenAccountTransaction(
    payer: PublicKey,
    mint: PublicKey
    ): Promise<[Transaction, PublicKey]> {
    const associatedTokenAddress = await token.getAssociatedTokenAddress(mint, payer, false);
    const transaction = new Transaction().add(
        token.createAssociatedTokenAccountInstruction(
            payer,
            associatedTokenAddress,
            payer,
            mint
        )
    )
    return [transaction, associatedTokenAddress];
}

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("/home/quarch/solana/turbo_raydium/main/src/wallet.json").toString()) as number[]));
    const transaction = new Transaction();
    // let [tx1, ata] = await buildCreateAssociatedTokenAccountTransaction(wallet.publicKey, mint.publicKey);
    // transaction.add(tx1);
    // await sendAndConfirmTransaction(connection, transaction, [wallet, mint]);
    let ata = await token.getAssociatedTokenAddress(new PublicKey("So11111111111111111111111111111111111111112"), new PublicKey("CwrNgGCWok1BCq3vt32juHGNuVHsdZGcmeZH3fSMNRdB"), false);
    console.log("ata : " + ata);
    console.log(token.TOKEN_PROGRAM_ID);
}

main();