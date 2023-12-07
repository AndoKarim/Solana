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

    const swapAuthority = new PublicKey("6mdBnge75QoPevJjjbR6zSQnKTDmCw6GL8v1X5H31xRo");
    const tokenAMint = new PublicKey("GYJXeCV9A9qD8f6gebBp34rnL4DuFBRToQFtfx3SwaQe");
    const [tokenATokenAccount, taci] = await getTokenAccountCreationInstruction(tokenAMint, swapAuthority, wallet.publicKey);
    const tx4 = new Transaction().add(taci);
    await sendAndConfirmTransaction(connection, tx4, [wallet]);

    console.log(tokenATokenAccount); // 9bfLak9sqdH6Zb95NTkJwDy3jsv22TyHLwk4srThzjBh
}

main();