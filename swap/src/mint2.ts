import { Transaction, Keypair, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
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
    const mint = new PublicKey("fT1yvHxNkPuwNoNkDbUj6CDxc9cyLhP8jqodZzJeQzP");

    let [tx2, ata] = await buildCreateAssociatedTokenAccountTransaction(wallet.publicKey, mint);
    await sendAndConfirmTransaction(connection, tx2, [wallet]);

    console.log("ata : " + ata);

}

main();