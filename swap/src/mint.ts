import { Transaction, Keypair, SystemProgram, Connection, PublicKey, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

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
    const mint = Keypair.generate();
    const amount = 1000;
    const decimals = 9;
    let tx = new Transaction().add(
        // create mint account
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mint.publicKey,
          space: token.MINT_SIZE,
          lamports: await token.getMinimumBalanceForRentExemptMint(connection),
          programId: token.TOKEN_PROGRAM_ID,
        }),
        // init mint account
        token.createInitializeMintInstruction(
          mint.publicKey, // mint pubkey
          decimals, // decimals
          wallet.publicKey, // mint authority
          null // freeze authority
        )
    );
    await sendAndConfirmTransaction(connection, tx, [wallet, mint]);

    let [tx2, ata] = await buildCreateAssociatedTokenAccountTransaction(wallet.publicKey, mint.publicKey);
    await sendAndConfirmTransaction(connection, tx2, [wallet]);
    console.log("ata : "+ata);

    await token.mintToChecked(
        connection, // connection
        wallet, // fee payer
        mint.publicKey, // mint
        ata, // receiver (ata)
        wallet, // mint authority
        amount * 10 ** decimals, // amount
        decimals // decimals
    );

    console.log("mint : " + mint.publicKey);

}

main();

// FOR SOME REASON RE-RUN FAST = BUG