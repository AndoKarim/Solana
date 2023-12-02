import { NATIVE_MINT, createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, getAccount } from "@solana/spl-token";
import { Transaction, Keypair, SystemProgram, Connection, PublicKey } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout } from "@solana/spl-token-swap";
const fs = require("fs")

async function main() {
    
    const connection = new Connection("https://api.devnet.solana.com");

    const usdc = new PublicKey("4yyWqsC4A554zVms2rww9RJ8xwxodfcPUGSxYJ95ziFa");
    let tokenAccount = await getAccount(connection, usdc);
    console.log(tokenAccount);
}

main();