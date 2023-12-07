import { Transaction, Keypair, SystemProgram, Connection, PublicKey, Account, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout, CurveType } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
import * as bs58 from 'bs58';
const fs = require("fs")



const keypair = Keypair.fromSecretKey(bs58.decode("5UYf5AFV7QcmD7XhnmHtzGhQVz5Fdcyb6pB731GysdREGDaSQnCfkERpobzBDYe5NgMMNFNUxwMoKnNT2ppeCeih"));
console.log(keypair);