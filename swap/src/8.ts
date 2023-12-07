import { Transaction, Keypair, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, CurveType } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));

    const tokenSwapStateAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/tokenSwapStateAccount.json").toString()) as number[]));
    const swapAuthority = new PublicKey("6mdBnge75QoPevJjjbR6zSQnKTDmCw6GL8v1X5H31xRo");
    const tokenATokenAccount = new PublicKey("9bfLak9sqdH6Zb95NTkJwDy3jsv22TyHLwk4srThzjBh");
    const tokenBTokenAccount = new PublicKey("J2YkWr4Q1gbZMjwf5acjdxJwTkp29u8PNxWcYPPq78gp");
    const poolTokenMint = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/poolTokenMint.json").toString()) as number[]));
    const tokenFeeAccountAddress = new PublicKey("ApgCg5W9MHwbMmap9TL2FZevHY6kP1zksmZK1vGb49on");
    const tokenAccountPool = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/tokenAccountPool.json").toString()) as number[]));
    const tokenSwapInitSwapInstruction = TokenSwap.createInitSwapInstruction(
        tokenSwapStateAccount,
        swapAuthority,
        tokenATokenAccount,
        tokenBTokenAccount,
        poolTokenMint.publicKey,
        tokenFeeAccountAddress,
        tokenAccountPool.publicKey,
        token.TOKEN_PROGRAM_ID,
        TOKEN_SWAP_PROGRAM_ID,
        BigInt(1),
        BigInt(100),
        BigInt(5),
        BigInt(10000),
        BigInt(1),
        BigInt(100),
        BigInt(1),
        BigInt(100),
        CurveType.ConstantProduct
    )
    const tx5 = new Transaction().add(tokenSwapInitSwapInstruction);
    await sendAndConfirmTransaction(connection, tx5, [wallet]);
}

main();