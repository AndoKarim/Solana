import { Transaction, Keypair, SystemProgram, Connection, PublicKey, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import * as token from "@solana/spl-token";
import * as fs from 'fs';

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("/home/quarch/solana/turbo_raydium/main/src/wallet.json").toString()) as number[]));
    const mint = Keypair.generate();
    const transaction = new Transaction();
    const amount = 1000;
    const decimals = 9;
    let tx0 = SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mint.publicKey,
          space: token.MINT_SIZE,
          lamports: await token.getMinimumBalanceForRentExemptMint(connection),
          programId: token.TOKEN_PROGRAM_ID,
        });
    transaction.add(tx0);

    let tx1 = token.createInitializeMintInstruction(
      mint.publicKey, // mint pubkey
      decimals, // decimals
      wallet.publicKey, // mint authority
      null // freeze authority
    );
    transaction.add(tx1);

    const associatedTokenAddress = await token.getAssociatedTokenAddress(mint.publicKey, wallet.publicKey, false);
    let tx2 = token.createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAddress,
        wallet.publicKey,
        mint.publicKey
    );
    transaction.add(tx2);
    console.log("ata : " + associatedTokenAddress);

    let tx3 = token.createMintToCheckedInstruction(
        mint.publicKey, // mint
        associatedTokenAddress, // receiver (ata)
        wallet.publicKey, // mint authority
        amount * 10 ** decimals, // amount
        decimals // decimals
    );
    transaction.add(tx3);
    console.log("mint : " + mint.publicKey);
    await sendAndConfirmTransaction(connection, transaction, [wallet, mint], { skipPreflight: true });

}

main();