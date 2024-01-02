import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import * as fs from 'fs';

const url = "https://api.mainnet-beta.solana.com";
const connection = new Connection(url);
const expectedLogPatternsRaydiumIDO = [
  /^Program ComputeBudget111111111111111111111111111111 invoke \[1\]$/,
  /^Program ComputeBudget111111111111111111111111111111 success$/,
  /^Program ComputeBudget111111111111111111111111111111 invoke \[1\]$/,
  /^Program ComputeBudget111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[1\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[1\]$/,
  /^Program log: Instruction: InitializeAccount$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 invoke \[1\]$/,
  /^Program log: initialize2: InitializeInstruction2 { nonce: \d+, open_time: \d+, init_pc_amount: \d+, init_coin_amount: \d+ }$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[2\]$/,
  /^Program log: Instruction: SyncNative$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[2\]$/,
  /^Program log: Instruction: InitializeMint$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[2\]$/,
  /^Program log: Instruction: InitializeAccount$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[2\]$/,
  /^Program log: Instruction: InitializeAccount$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[2\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX invoke \[2\]$/,
  /^Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX consumed \d+ of \d+ compute units$/,
  /^Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX success$/,
  /^Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke \[2\]$/,
  /^Program log: Create$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[3\]$/,
  /^Program log: Instruction: GetAccountDataSize$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA .*$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program 11111111111111111111111111111111 invoke \[3\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program log: Initialize the associated token account$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[3\]$/,
  /^Program log: Instruction: InitializeImmutableOwner$/,
  /^Program log: Please upgrade to SPL Token 2022 for immutable owner support$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[3\]$/,
  /^Program log: Instruction: InitializeAccount3$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed \d+ of \d+ compute units$/,
  /^Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[2\]$/,
  /^Program log: Instruction: Transfer$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[2\]$/,
  /^Program log: Instruction: Transfer$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[2\]$/,
  /^Program log: Instruction: MintTo$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
  /^Program log: ray_log: .*$/,
  /^Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 consumed \d+ of \d+ compute units$/,
  /^Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 success$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[1\]$/,
  /^Program log: Instruction: CloseAccount$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
  /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
];
const expectedLogPatternsSerumMarket = [
  /^Program 11111111111111111111111111111111 invoke \[1\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[1\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[1\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[1\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program 11111111111111111111111111111111 invoke \[1\]$/,
  /^Program 11111111111111111111111111111111 success$/,
  /^Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX invoke \[1\]$/,
  /^Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX consumed \d+ of \d+ compute units$/,
  /^Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX success$/,
];
const Serum = new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX");
let poolCounter = 0;
interface RaydiumSwapPubkeys {
  amm_id: String,
  amm_open_orders: String,
  amm_target_orders: String,
  pool_coin_token_account: String,
  pool_pc_token_account: String,
  serum_market: String,
  serum_bids: String,
  serum_asks: String,
  serum_event_queue: String,
  serum_coin_vault_account: String,
  serum_pc_vault_account: String,
  serum_vault_signer: String,
  mint: String
}
const headers = {
  'Content-Type': 'application/json',
};
let serumPubkeys: string[][] = [];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getVaultSigner(account: string): Promise<string> {
  const data = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getAccountInfo',
    params: [
      account,
      {
        encoding: 'jsonParsed',
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.result.value.data.parsed.info.owner;
  } catch (error) {
    console.error('Error:', error);
    return("error");
  }
}

async function requestTransactionSerum(signature: string) {
  let data = {
      jsonrpc: '2.0',
      id: 1,
      "method": "getTransaction",
      "params": [
      signature,
      {"commitment": "confirmed", "encoding": "json", "maxSupportedTransactionVersion":0}
      ]
  };

  try {
      let response = await axios.post(url, data, { headers });
      for (let i = 0 ; i < 10 ; i++) {
        if (!response || !response.data || !response.data.result) {
          console.log("delaying");
          delay(1000);
        }
      }
      let accounts = response.data.result.transaction.message.accountKeys;
      serumPubkeys.push([accounts[1], accounts[6], accounts[4], accounts[5], accounts[3], accounts[6], accounts[7], accounts[11]])
  } catch (error) {
      console.error('ERROR : ', error);
  }
}

async function requestTransactionRaydium(signature: string) {
  let data = {
      jsonrpc: '2.0',
      id: 1,
      "method": "getTransaction",
      "params": [
      signature,
      {"commitment": "confirmed", "encoding": "json", "maxSupportedTransactionVersion":0}
      ]
  };

  try {
      console.log("or there");
      let response = await axios.post(url, data, { headers });
      let accounts = response.data.result.transaction.message.accountKeys;
      for (let i = 0 ; i < serumPubkeys.length ; i++) {
        if (accounts[19] == serumPubkeys[i][0]) {
          let vault_signer = await getVaultSigner(serumPubkeys[i][1]);
          if (vault_signer == "error") { break }
          const swap_pubkeys: RaydiumSwapPubkeys = {
            amm_id: accounts[2],
            amm_open_orders: accounts[3],
            amm_target_orders: accounts[7],
            pool_coin_token_account: accounts[5],
            pool_pc_token_account: accounts[6],
            serum_market: accounts[19],
            serum_bids: serumPubkeys[i][2],
            serum_asks: serumPubkeys[i][3],
            serum_event_queue: serumPubkeys[i][4],
            serum_coin_vault_account: serumPubkeys[i][5],
            serum_pc_vault_account: serumPubkeys[i][6],
            serum_vault_signer: vault_signer,
            mint: serumPubkeys[i][7]
          };
          const jsonString: string = JSON.stringify(swap_pubkeys, null, 4);
          poolCounter++;
          fs.writeFileSync(`${poolCounter}.json`, jsonString, 'utf-8');
          console.log(`NEW POOL (${poolCounter}) at ${(new Date).toTimeString().slice(0, 8)}\nSignature : ${response.data}\n`);
          serumPubkeys[i][0] = "null";
        }
      }
  } catch (error) {
      console.error('ERROR : ', error);
  }
}

connection.onLogs(
  Serum,
  (data, context) =>
    {
      try {
        if (data && data.logs) {
          let logMessages = data.logs;
          let isExpectedSequence = expectedLogPatternsSerumMarket.every((pattern, index) => pattern.test(logMessages[index]));
          if (isExpectedSequence) {
            console.log(`Serum init at ${(new Date).toTimeString().slice(0, 8)}\nSignature : ${data.signature}\n`);
            requestTransactionSerum(data.signature);
          }
          isExpectedSequence = expectedLogPatternsRaydiumIDO.every((pattern, index) => pattern.test(logMessages[index]));
          if (isExpectedSequence) {
            requestTransactionRaydium(data.signature);
          }
        }
      } catch (e) {
      console.error('Caught error : ', e);
      }
    },
  "confirmed"
);