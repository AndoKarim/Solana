import * as web3 from "@solana/web3.js";
const fs = require("fs")
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

async function main() {

  const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");
  const senderKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));
  const receiverPubkey = new web3.PublicKey("6mdBnge75QoPevJjjbR6zSQnKTDmCw6GL8v1X5H31xRo"); //swapAuthority
  const mint = new web3.PublicKey("GYJXeCV9A9qD8f6gebBp34rnL4DuFBRToQFtfx3SwaQe");
  const senderATA = await getAssociatedTokenAddress(mint, senderKeypair.publicKey);
  const receiverATA = new web3.PublicKey("9bfLak9sqdH6Zb95NTkJwDy3jsv22TyHLwk4srThzjBh"); //tokenATokenAccount
  const amount = 500;
  const decimals = 2;
  const tx1 = new web3.Transaction().add(createAssociatedTokenAccountInstruction(
        senderKeypair.publicKey,
        receiverATA,
        receiverPubkey,
        mint
    ))
  await web3.sendAndConfirmTransaction(connection, tx1, [senderKeypair]);
  let tx2 = new web3.Transaction().add(createTransferCheckedInstruction(
      senderATA,
      mint,
      receiverATA,
      senderKeypair.publicKey,
      amount * 10 ** decimals,
      decimals
    ));
  await web3.sendAndConfirmTransaction(connection, tx2, [senderKeypair]);

}

main();