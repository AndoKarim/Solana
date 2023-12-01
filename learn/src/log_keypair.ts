import { Keypair } from "@solana/web3.js";
const fs = require("fs")
const secret = JSON.parse(fs.readFileSync("AaaipcFKbS8LJkR9t7kHwqJRL5Q8gdQe5nYxd6mMucbf.json").toString()) as number[]
const secretKey = Uint8Array.from(secret)
const payer = Keypair.fromSecretKey(secretKey)
console.log(payer.publicKey.toBase58())