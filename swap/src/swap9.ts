import { Transaction, Keypair, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

async function getTokenAccountCreationInstruction(
    mint: PublicKey,
    owner : PublicKey,
    payer: PublicKey
    ): Promise<[PublicKey, Transaction]> {
    const associatedTokenAddress = await token.getAssociatedTokenAddress(mint, owner, true);
    const transaction = new Transaction().add(
        token.createAssociatedTokenAccountInstruction(
            payer,
            associatedTokenAddress,
            owner,
            mint
        )
    )
    return [associatedTokenAddress, transaction];
}

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));

    const poolTokenMint = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/poolTokenMint.json").toString()) as number[]));
    const feeOwner = new PublicKey("HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN");
    const [tokenFeeTokenAccountAddress, tfaci] = await getTokenAccountCreationInstruction(poolTokenMint.publicKey, feeOwner, wallet.publicKey);
    const tx4 = new Transaction().add(tfaci);
    await sendAndConfirmTransaction(connection, tx4, [wallet]);

    console.log(tokenFeeTokenAccountAddress); // ApgCg5W9MHwbMmap9TL2FZevHY6kP1zksmZK1vGb49on
}

main();