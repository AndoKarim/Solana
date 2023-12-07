import { Transaction, Keypair, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const user = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev2_wallet.json").toString()) as number[]));
    const tokenSwapStateAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/tokenSwapStateAccount.json").toString()) as number[]));
    const swapAuthority = new PublicKey("6mdBnge75QoPevJjjbR6zSQnKTDmCw6GL8v1X5H31xRo");
    const tokenATokenAccount = new PublicKey("9bfLak9sqdH6Zb95NTkJwDy3jsv22TyHLwk4srThzjBh");
    const tokenBTokenAccount = new PublicKey("J2YkWr4Q1gbZMjwf5acjdxJwTkp29u8PNxWcYPPq78gp");
    const mintA = new PublicKey("GYJXeCV9A9qD8f6gebBp34rnL4DuFBRToQFtfx3SwaQe");
    const mintB = new PublicKey("8FEihGfTQStJzvs16YvV5uDo2x1wnzHFen86F2s911n9");
    const poolTokenMint = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/poolTokenMint.json").toString()) as number[]));
    const tokenAccountPool = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/tokenAccountPool.json").toString()) as number[]));
    const userTokenAATA = await token.getAssociatedTokenAddress(mintA, user.publicKey);
    const userTokenBATA = await token.getAssociatedTokenAddress(mintB, user.publicKey);
    const feeAccount = await token.getAssociatedTokenAddress(poolTokenMint.publicKey, new PublicKey("HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN"));
    const swap = TokenSwap.swapInstruction(
        tokenSwapStateAccount.publicKey,
        swapAuthority,
        user.publicKey,
        userTokenAATA,
        tokenATokenAccount,
        tokenBTokenAccount,
        userTokenBATA,
        poolTokenMint.publicKey,
        feeAccount,
        null,
        mintA,
        mintB,
        TOKEN_SWAP_PROGRAM_ID,
        token.TOKEN_PROGRAM_ID,
        token.TOKEN_PROGRAM_ID,
        token.TOKEN_PROGRAM_ID,
        BigInt(2),
        BigInt(0)
    )
    const tx5 = new Transaction().add(swap);
    await sendAndConfirmTransaction(connection, tx5, [user]);
}

main();