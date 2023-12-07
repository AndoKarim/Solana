import { Transaction, Keypair, SystemProgram, Connection, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout, CurveType } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
const fs = require("fs")

async function getTokenAccountCreationInstruction(
    mint: PublicKey,
    owner : PublicKey,
    payer: PublicKey
    ): Promise<[PublicKey, Transaction]> {
    const associatedTokenAddress = await token.getAssociatedTokenAddress(mint, owner, true);
    const transaction = new Transaction().add(
        token.createAssociatedTokenAccountInstruction(
            payer,
            associatedTokenAddress,
            owner,
            mint
        )
    )
    return [associatedTokenAddress, transaction];
}

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

    const [swapAuthority, bump] = PublicKey.findProgramAddressSync(
        [tokenSwapStateAccount.publicKey.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    );

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

    const tokenAccountPool = Keypair.generate();
    const poolAccountRent = await token.getMinimumBalanceForRentExemptAccount(connection);
    const createTokenAccountPoolInstruction = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: tokenAccountPool.publicKey,
        space: token.ACCOUNT_SIZE,
        lamports: poolAccountRent,
        programId: token.TOKEN_PROGRAM_ID,
    });
    const initializeTokenAccountPoolInstruction = token.createInitializeAccountInstruction(
        tokenAccountPool.publicKey,
        poolTokenMint.publicKey,
        wallet.publicKey
    )
    const tx3 = new Transaction().add(createTokenAccountPoolInstruction, initializeTokenAccountPoolInstruction);
    await sendAndConfirmTransaction(connection, tx3, [wallet, tokenAccountPool]);

    const tokenAMint = new PublicKey("GYJXeCV9A9qD8f6gebBp34rnL4DuFBRToQFtfx3SwaQe");
    const [tokenATokenAccount, taci] = await getTokenAccountCreationInstruction(tokenAMint, swapAuthority, wallet.publicKey);
    const tx4 = new Transaction().add(taci);
    await sendAndConfirmTransaction(connection, tx4, [wallet]);

    const tokenBMint = new PublicKey("8FEihGfTQStJzvs16YvV5uDo2x1wnzHFen86F2s911n9");
    const [tokenBTokenAccount, tbci] = await getTokenAccountCreationInstruction(tokenBMint, swapAuthority, wallet.publicKey);
    const tx5 = new Transaction().add(tbci);
    await sendAndConfirmTransaction(connection, tx5, [wallet]);

    const feeOwner = new PublicKey("HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN");
    const [tokenFeeAccountAddress, tfaci] = await getTokenAccountCreationInstruction(poolTokenMint.publicKey, feeOwner, wallet.publicKey);
    const tx6 = new Transaction().add(tfaci);
    await sendAndConfirmTransaction(connection, tx6, [wallet]);

    const tokenSwapInitSwapInstruction = TokenSwap.createInitSwapInstruction(
        tokenSwapStateAccount,
        swapAuthority,
        tokenATokenAccount,
        tokenBTokenAccount,
        poolTokenMint.publicKey,
        tokenFeeAccountAddress,
        tokenAccountPool.publicKey,
        token.TOKEN_PROGRAM_ID,
        TOKEN_SWAP_PROGRAM_ID,
        BigInt(1),
        BigInt(100),
        BigInt(5),
        BigInt(10000),
        BigInt(1),
        BigInt(100),
        BigInt(1),
        BigInt(100),
        CurveType.ConstantProduct
    )
    const tx7 = new Transaction().add(tokenSwapInitSwapInstruction);
    await sendAndConfirmTransaction(connection, tx7, [wallet]);

}

main();