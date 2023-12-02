import { NATIVE_MINT, createAssociatedTokenAccount, createInitializeAccountInstruction, createAssociatedTokenAccountInstruction, getAccount, mintToChecked, createMint, ACCOUNT_SIZE, TOKEN_PROGRAM_ID, getMinimumBalanceForRentExemptAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { Transaction, Keypair, SystemProgram, Connection, PublicKey } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout } from "@solana/spl-token-swap";
const fs = require("fs");

async function main() {

  const connection = new Connection("https://api.devnet.solana.com");
  const transaction = new Transaction();
  const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("../json/dev_wallet.json").toString()) as number[]));
  const tokenSwapStateAccount = Keypair.generate();
  const rent = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection);
  const tokenSwapStateAccountInstruction = await SystemProgram.createAccount({
    newAccountPubkey: tokenSwapStateAccount.publicKey,
    fromPubkey: wallet.publicKey,
    lamports: rent,
    space: TokenSwapLayout.span,
    programId: TOKEN_SWAP_PROGRAM_ID
  });
  transaction.add(tokenSwapStateAccountInstruction);
  
  const [swapAuthority, bump] = await PublicKey.findProgramAddress(
    [tokenSwapStateAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID,
  );
  
  const mintTokenA = new PublicKey("So11111111111111111111111111111111111111112");
  const mintTokenB = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
  let tokenAAccountAddress = await createAssociatedTokenAccount(
    connection,
    wallet,
    mintTokenA,
    wallet.publicKey
  );
  const tokenAAccountInstruction = await createAssociatedTokenAccountInstruction(
    wallet.publicKey,
    tokenAAccountAddress,
    wallet.publicKey,
    mintTokenA
  );
  let tokenBAccountAddress = await createAssociatedTokenAccount(
    connection,
    wallet,
    mintTokenB,
    wallet.publicKey
  );
  const tokenBAccountInstruction = await createAssociatedTokenAccountInstruction(
    wallet.publicKey,
    tokenBAccountAddress,
    wallet.publicKey,
    mintTokenB
  );
  transaction.add(tokenAAccountInstruction);
  transaction.add(tokenBAccountInstruction);

  const poolTokenMint = await createMint(
    connection,
    wallet,
    swapAuthority,
    null,
    2
  );
  
  const tokenAccountPool = Keypair.generate();
  const rent2 = await getMinimumBalanceForRentExemptAccount(connection);
  const createTokenAccountPoolInstruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: tokenAccountPool.publicKey,
    space: ACCOUNT_SIZE,
    lamports: rent2,
    programId: TOKEN_PROGRAM_ID,
  });
  const initializeTokenAccountPoolInstruction = createInitializeAccountInstruction(
    tokenAccountPool.publicKey,
    poolTokenMint,
    wallet.publicKey
  );
  transaction.add(createTokenAccountPoolInstruction);
  transaction.add(initializeTokenAccountPoolInstruction);

  const feeOwner = new PublicKey('HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN');

  let tokenFeeAccountAddress = await getAssociatedTokenAddress(
    poolTokenMint, // mint
    feeOwner, // owner
    true // allow owner off curve
  );

  const tokenFeeAccountInstruction = await createAssociatedTokenAccountInstruction(
    wallet.publicKey, // payer
    tokenFeeAccountAddress, // ata
    feeOwner, // owner
    poolTokenMint // mint
  );
  transaction.add(tokenFeeAccountInstruction);

}

main();