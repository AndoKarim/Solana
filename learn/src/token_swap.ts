import { Transaction, Keypair, SystemProgram, Connection, PublicKey } from '@solana/web3.js';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID, TokenSwapLayout } from "@solana/spl-token-swap";
const fs = require("fs")

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("BobW7nJ2H16mEbS4zG2WLvR23v8CSZHTmDMHJRGbEh3c.json").toString()) as number[]));
    const transaction = new Transaction();
    const tokenSwapStateAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("TSSSxoMpRwURME6zVH8L36q5sBgsYrhz9Zco38bUHWt.json").toString()) as number[]));
    const rent = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection);
    const tokenSwapStateAccountCreationInstruction = await SystemProgram.createAccount({
        newAccountPubkey: tokenSwapStateAccount.publicKey,
        fromPubkey: wallet.publicKey,
        lamports: rent,
        space: TokenSwapLayout.span,
        programId: TOKEN_SWAP_PROGRAM_ID
    })
    transaction.add(tokenSwapStateAccountCreationInstruction)

    const [swapAuthority, bump] = await PublicKey.findProgramAddress(
        [tokenSwapStateAccount.publicKey.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    )

    async function getTokenAccountCreationInstruction(mint: PublicKey, swapAuthority: PublicKey, payer: PublicKey): Promise<[PublicKey,TransactionInstruction]>{

        let tokenAccountAddress = await token.getAssociatedTokenAddress(
            mint,
            swapAuthority,
            true
        )

        const tokenAccountInstruction = await token.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            tokenAccountAddress,
            swapAuthority,
            mint
        )

        return [tokenAccountAddress, tokenAccountInstruction];
    }

    const tokenAMint = new PublicKey("TkA718Lq8ETcTmLjJFZUTqt1i9R987wDkdVEsPA8TPn.json");
    const tokenBMint = new PublicKey("TkBKqufK2idPVf27uwtnbtCL3ttUAioNPLK46GT14VD.json");
    const [tokenATokenAccount, taci] = await getTokenAccountCreationInstruction(tokenAMint, swapAuthority, wallet.publicKey);
    const [tokenBTokenAccount, tbci] = await getTokenAccountCreationInstruction(tokenBMint, swapAuthority, wallet.publicKey);

    const poolTokenMint = await token.createMint(
        connection,
        wallet,
        swapAuthority,
        null,
        2
    )
    
    transaction.add(tokenAAccountInstruction)

    const tokenSwapInitSwapInstruction = TokenSwap.createInitSwapInstruction(
        tokenSwapStateAccount,
        swapAuthority,

    )
}

main();