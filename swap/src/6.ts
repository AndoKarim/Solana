import { Transaction, Keypair, SystemProgram, Connection, PublicKey, Account, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout, CurveType } from "@solana/spl-token-swap";
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
    const tokenBMint = new PublicKey("8FEihGfTQStJzvs16YvV5uDo2x1wnzHFen86F2s911n9");
    const [tokenBTokenAccount, tbci] = await getTokenAccountCreationInstruction(tokenBMint, swapAuthority, wallet.publicKey);
    const tx4 = new Transaction().add(tbci);
    await sendAndConfirmTransaction(connection, tx4, [wallet]);

    console.log(tokenBTokenAccount); // J2YkWr4Q1gbZMjwf5acjdxJwTkp29u8PNxWcYPPq78gp
}

main();