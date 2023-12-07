import { Transaction, Keypair, SystemProgram, Connection, PublicKey, Account, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout, CurveType } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));

    const tokenSwapStateAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/tokenSwapStateAccount.json").toString()) as number[]));
    const [swapAuthority, bump] = PublicKey.findProgramAddressSync(
        [tokenSwapStateAccount.publicKey.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    );

    console.log(swapAuthority);

}

main();