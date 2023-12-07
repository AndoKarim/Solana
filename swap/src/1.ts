import { Transaction, Keypair, SystemProgram, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout } from "@solana/spl-token-swap";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));

    const tokenSwapStateAccount = Keypair.generate();
    const rent = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection);
    const tokenSwapStateAccountCreationInstruction = SystemProgram.createAccount({
        newAccountPubkey: tokenSwapStateAccount.publicKey,
        fromPubkey: wallet.publicKey,
        lamports: rent,
        space: TokenSwapLayout.span,
        programId: TOKEN_SWAP_PROGRAM_ID
    });
    const tx1 = new Transaction().add(tokenSwapStateAccountCreationInstruction);
    await sendAndConfirmTransaction(connection, tx1, [wallet, tokenSwapStateAccount]);

    console.log(tokenSwapStateAccount);
        

}

main();