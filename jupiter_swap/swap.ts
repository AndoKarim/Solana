import fetch from 'node-fetch';
import { Keypair, Connection, VersionedTransaction, ComputeBudgetProgram } from '@solana/web3.js';
import bs58 from 'bs58';

const SOLANA_RPC_ENDPOINT = "https://coriss-b5f2se-fast-mainnet.helius-rpc.com/";
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
const USER_KEYPAIR = Keypair.fromSecretKey(USER_PRIVATE_KEY);
const USER_KEYPAIR_BASE58 = USER_KEYPAIR.publicKey.toBase58();

const PRIORITY_FEE_LAMPORTS = 100;

const feePayer = [];

const INPUT_TOKEN = "So11111111111111111111111111111111111111112";
const OUTPUT_TOKEN = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R";
const AMOUNT = 1000000;
const SLIPPAGE_BPS = 0.5 * 100;

const FIND_ROUTE_URL = `https://quote-api.jup.ag/v6/quote?inputMint=${INPUT_TOKEN}&outputMint=${OUTPUT_TOKEN}&amount=${AMOUNT}&slippageBps=${SLIPPAGE_BPS}`;
const SWAP_TOKENS_URL = `https://quote-api.jup.ag/v6/swap`;

const SOLANA_CONNECTION = new Connection(SOLANA_RPC_ENDPOINT);

// const SHYFT = new ShyftSdk({
//   apiKey: process.env.API_KEY || "",
//   network: Network.Mainnet,
// });

async function signTransaction(private_keys, encoded_transaction) {
  try{
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: PRIORITY_FEE_LAMPORTS
      });

      const connection = SOLANA_CONNECTION;
      const keys = private_keys.map((k) =>{
          return Keypair.fromSecretKey(bs58.decode(k));
      });
      const recoveredTransaction = VersionedTransaction.deserialize(Buffer.from(encoded_transaction, 'base64'));
      recoveredTransaction.sign(keys);
      const confirmTransaction = await connection.sendRawTransaction(recoveredTransaction.serialize(), {skipPreflight: true});
      return confirmTransaction;
  } catch (error){
      console.log(error);
  }
};

const findSwapRoute = async () => {
  const req = await fetch(FIND_ROUTE_URL, {
    method: 'GET',
  });
  const bestRoute = await req.json();
  bestRoute.routePlan.forEach(route => {
    route.swapInfo.feeAmount = (parseInt(route.swapInfo.feeAmount) * 3).toString();
});
  return bestRoute;
};

const swapTokens = async () => {
  const body = {
    userPublicKey: USER_KEYPAIR_BASE58,
    wrapAndUnwrapSol: true,
    useSharedAccounts: true,
    computeUnitPriceMicroLamports: "auto",
    asLegacyTransaction: false,
    quoteResponse: await findSwapRoute(),
  };

  const req = await fetch(SWAP_TOKENS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const res = await req.json();
  const swapTransaction = res.swapTransaction.toString().trim();
  console.log(swapTransaction);

  await signTransaction(feePayer, swapTransaction);
};

swapTokens();