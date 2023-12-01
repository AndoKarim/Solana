import * as web3 from "@solana/web3.js";
import * as dotenv from "dotenv";
import base58 from "bs58";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers"

async function main() {

const toPubkey = new web3.PublicKey("CwrNgGCWok1BCq3vt32juHGNuVHsdZGcmeZH3fSMNRdB")

dotenv.config();

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");

console.log(`✅ Loaded our own keypair, the destination public key, and connected to Solana`);

const transaction = new web3.Transaction();

const LAMPORTS_TO_SEND = 0.1 * web3.LAMPORTS_PER_SOL;

const sendSolInstruction = web3.SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await web3.sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);

console.log(`💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `);
console.log(`Transaction signature is ${signature}!`);

}

main();