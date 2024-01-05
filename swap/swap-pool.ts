import { Transaction, Keypair, SystemProgram, Connection, sendAndConfirmTransaction, PublicKey, TransactionStatus } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout, CurveType } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
import * as fs from 'fs';

async function main() {
    try {
        const connection = new Connection("https://api.devnet.solana.com");
        const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("/home/quarch/solana/turbo_raydium/main/src/wallet.json").toString()) as number[]));
        let transaction = new Transaction();
        let finalTransaction = new Transaction();

        const tokenSwapStateAccount = Keypair.generate();
        const rent = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection);
        let tx1 = SystemProgram.createAccount({
            newAccountPubkey: tokenSwapStateAccount.publicKey,
            fromPubkey: wallet.publicKey,
            lamports: rent,
            space: TokenSwapLayout.span,
            programId: TOKEN_SWAP_PROGRAM_ID
        });
        transaction.add(tx1);

        const [swapAuthority, bump] = PublicKey.findProgramAddressSync(
            [tokenSwapStateAccount.publicKey.toBuffer()],
            TOKEN_SWAP_PROGRAM_ID,
        );

        const poolTokenMint = Keypair.generate();
        let tx2 = SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: poolTokenMint.publicKey,
            space: token.MINT_SIZE,
            lamports: await token.getMinimumBalanceForRentExemptMint(connection),
            programId: token.TOKEN_PROGRAM_ID,
        });
        transaction.add(tx2);

        let tx3 = token.createInitializeMintInstruction(
            poolTokenMint.publicKey, // mint pubkey
            2, // decimals
            swapAuthority, // mint authority
            null // freeze authority
        );
        transaction.add(tx3);

        const tokenAccountPool = Keypair.generate();
        const poolAccountRent = await token.getMinimumBalanceForRentExemptAccount(connection);
        let tx4 = SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: tokenAccountPool.publicKey,
            space: token.ACCOUNT_SIZE,
            lamports: poolAccountRent,
            programId: token.TOKEN_PROGRAM_ID,
        });
        transaction.add(tx4);

        let tx5 = token.createInitializeAccountInstruction(
            tokenAccountPool.publicKey,
            poolTokenMint.publicKey,
            wallet.publicKey
        );
        transaction.add(tx5);

        const tokenAMint = new PublicKey("CcQDNWqgiKoEf7VVehqbhd69yb8Ft14iqWV5RzCWHShE");
        const tokenAMintATA = await token.getAssociatedTokenAddress(tokenAMint, swapAuthority, true);
        let tx6 = token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenAMintATA,
            swapAuthority,
            tokenAMint
        );
        transaction.add(tx6);

        const tokenBMint = new PublicKey("9s6PFnLEy2grHiSYHfNfhPbE4YFdsN3fBa9sZ2k5QHcn");
        const tokenBMintATA = await token.getAssociatedTokenAddress(tokenBMint, swapAuthority, true);
        let tx7 = token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenBMintATA,
            swapAuthority,
            tokenBMint
        );
        transaction.add(tx7);

        const senderTokenAATA = await token.getAssociatedTokenAddress(tokenAMint, wallet.publicKey, true);
        const amount = 500;
        const decimals = 2;
        let tx8 = token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenAMintATA,
            swapAuthority,
            tokenAMint
        );
        transaction.add(tx8);

        let tx9 = token.createTransferCheckedInstruction(
        senderTokenAATA,
        tokenAMint,
        tokenAMintATA,
        wallet.publicKey,
        amount * 10 ** decimals,
        decimals
        );
        transaction.add(tx9);

        const senderTokenBATA = await token.getAssociatedTokenAddress(tokenBMint, wallet.publicKey, true);
        const amount2 = 500;
        const decimals2 = 2;
        let tx10 = token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenBMintATA,
            swapAuthority,
            tokenBMint
        );
        transaction.add(tx10);

        let tx11 = token.createTransferCheckedInstruction(
        senderTokenBATA,
        tokenBMint,
        tokenBMintATA,
        wallet.publicKey,
        amount2 * 10 ** decimals2,
        decimals2
        );
        transaction.add(tx11);

        const feeOwner = new PublicKey("HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN");
        const tokenFeeAccountAddress = await token.getAssociatedTokenAddress(poolTokenMint.publicKey, feeOwner, true);
        let tx12 = token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenFeeAccountAddress,
            feeOwner,
            poolTokenMint.publicKey
        );
        transaction.add(tx12);
        
        await sendAndConfirmTransaction(connection, transaction, [wallet, tokenSwapStateAccount, poolTokenMint, tokenAccountPool], { skipPreflight: true });

        let tx13 = TokenSwap.createInitSwapInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            tokenAMintATA,
            tokenBMintATA,
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
        finalTransaction.add(tx13);
        
        await sendAndConfirmTransaction(connection, finalTransaction, [wallet], { skipPreflight: true });
    } catch(error) {
        console.log("Error : ", error);
    }

}

main();