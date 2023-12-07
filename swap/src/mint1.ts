import { Transaction, Keypair, SystemProgram, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {

    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));
    const mint = Keypair.generate();
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

    console.log("mint : " + mint.publicKey);

}

main();