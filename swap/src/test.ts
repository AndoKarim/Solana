import { Transaction, Keypair, SystemProgram, Connection, PublicKey, Account, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout, CurveType } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
import * as bs58 from 'bs58';
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
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));
    const transaction = new Transaction();
    let [tx1, ata] = await buildCreateAssociatedTokenAccountTransaction(wallet.publicKey, mint.publicKey);
    transaction.add(tx1);
    await sendAndConfirmTransaction(connection, transaction, [wallet, mint]);
    console.log("ata : " + ata);
}

main();