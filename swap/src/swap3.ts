import { Transaction, Keypair, SystemProgram, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from "@solana/spl-token";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));

    const swapAuthority = new PublicKey("6mdBnge75QoPevJjjbR6zSQnKTDmCw6GL8v1X5H31xRo");
    const poolTokenMint = Keypair.generate();
    const tx2 = new Transaction().add(
        // create mint account
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: poolTokenMint.publicKey,
          space: token.MINT_SIZE,
          lamports: await token.getMinimumBalanceForRentExemptMint(connection),
          programId: token.TOKEN_PROGRAM_ID,
        }),
        // init mint account
        token.createInitializeMintInstruction(
          poolTokenMint.publicKey, // mint pubkey
          2, // decimals
          swapAuthority, // mint authority
          null // freeze authority
        )
    );
    await sendAndConfirmTransaction(connection, tx2, [wallet, poolTokenMint]);

    console.log(poolTokenMint);
}

main();