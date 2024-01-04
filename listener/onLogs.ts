import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import WebSocket from 'ws';
import * as fs from 'fs';

const url = JSON.parse(fs.readFileSync("/home/quarch/solana/listener/rpc_helius.json").toString());
const wss_helius = JSON.parse(fs.readFileSync("/home/quarch/solana/listener/wss_helius.json").toString());
const ws = new WebSocket(wss_helius);
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
const RaydiumAuthorityV4 = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";
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
let priceAction: string[][] = [];

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
    console.error('getvaultSigner error :', error);
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
      for (let i = 0 ; i < 5 ; i++) {
        if (!response || !response.data || !response.data.result) {
          response = await axios.post(url, data, { headers });
          delay(500);
        }
      }
      let accounts = response.data.result.transaction.message.accountKeys;
      let keys = response.data.result.transaction.message.instructions[5].accounts;
      serumPubkeys.push([accounts[keys[0]], accounts[keys[3]], accounts[keys[4]], accounts[keys[2]], accounts[keys[5]], accounts[keys[6]], accounts[keys[7]]])
  } catch (error) {
      console.error('requestTransactionSerum error : ', error);
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
      let response = await axios.post(url, data, { headers });
      for (let i = 0 ; i < 5 ; i++) {
        if (!response || !response.data || !response.data.result || !response.data.result.transaction || !response.data.result.transaction.message) {
          response = await axios.post(url, data, { headers });
          delay(500);
        }
      }
      let accounts = response.data.result.transaction.message.accountKeys;
      let keys = response.data.result.transaction.message.instructions[4].accounts;
      for (let i = 0 ; i < serumPubkeys.length ; i++) {
        if (accounts[keys[16]] == serumPubkeys[i][0]) {
          let vault_signer = await getVaultSigner(serumPubkeys[i][4]);
          if (vault_signer == "error") { break }
          const swap_pubkeys: RaydiumSwapPubkeys = {
            amm_id: accounts[keys[4]],
            amm_open_orders: accounts[keys[6]],
            amm_target_orders: accounts[keys[12]],
            pool_coin_token_account: accounts[keys[10]],
            pool_pc_token_account: accounts[keys[11]],
            serum_market: accounts[keys[16]],
            serum_bids: serumPubkeys[i][1],
            serum_asks: serumPubkeys[i][2],
            serum_event_queue: serumPubkeys[i][3],
            serum_coin_vault_account: serumPubkeys[i][4],
            serum_pc_vault_account: serumPubkeys[i][5],
            serum_vault_signer: vault_signer,
            mint: serumPubkeys[i][6]
          };
          const jsonString: string = JSON.stringify(swap_pubkeys, null, 4);
          poolCounter++;
          fs.writeFileSync(`poolsjson/${poolCounter}.json`, jsonString, 'utf-8');
          priceAction.push([accounts[keys[16]], (response.data.result.meta.postTokenBalances[1].uiTokenAmount.uiAmount / response.data.result.meta.postTokenBalances[0].uiTokenAmount.uiAmount).toString(), (response.data.result.meta.postTokenBalances[0].uiTokenAmount.decimals).toString(), serumPubkeys[i][6]]);
          console.log(`NEW POOL (${poolCounter}) at ${(new Date).toTimeString().slice(0, 8)}\nSignature : ${response.data.result.transaction.signatures}\n`);
          serumPubkeys[i][0] = "null";
        }
      }
  } catch (error) {
      console.error('requestTransactionRaydium error : ', error);
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
      console.error('onLogs error : ', e);
      }
    },
  "confirmed"
);

function chart(price: number[], multiplier: number): void {
  let row = '';
  for (let i = 0; i < 50; i++) {
      for (let j = 0; j < price.length; j++) {
          if (j == 0) {
              if (price[j] >= (50 - i)) {
                  row += ' \u25A0';
              } else {
                  row += '  ';
              }
          } else {
              if (price[j] >= price[j - 1]) {
                  if (price[j] >= (50 - i) && price[j - 1] < (51 - i)) {
                      row += ' \u25A0';
                  } else {
                      row += '  ';
                  }
              } else {
                  if (price[j] <= (50 - i) && price[j - 1] > (49 - i)) {
                      row += ' \u25A0';
                  } else {
                      row += '  ';
                  }
              }
          }
      }
      if (price.length > 1 && price[price.length - 1] == (50 - i)) {
          row += ' +';
          row += ((49 - i) * (100 / multiplier)).toString();
          row += '%';
      }
      row += '\n';
  }
  console.log(row);
}

function sendRequest(ws: WebSocket) {
  const request = {
      jsonrpc: "2.0",
      id: 420,
      method: "transactionSubscribe",
      params: [
          {
              vote: false,
              failed: false,
              accountInclude: [],
              accountRequired: [Serum, RaydiumAuthorityV4],
              accountExclude: []
          },
          {
              commitment: "confirmed",
              encoding: "jsonParsed",
              transaction_details: "full",
              showRewards: false,
              maxSupportedRransactionVersion: 0
          }
      ]
  };
  ws.send(JSON.stringify(request));
}

ws.on('open', function open() {
  sendRequest(ws);
});
let checker = -1;
let mult = 1;
let multiplier = 0;
let charting: number[] = [];
ws.on('message', async function incoming(data) {
  const messageStr = data.toString('utf8');
  try {
      const messageObj = JSON.parse(messageStr);
      if (messageObj.method === 'transactionNotification') {
          const result = messageObj.params.result;
          if (result && result.transaction) {
            let pubkeys: string[] = [];
            for (let i = 0 ; i < result.transaction.transaction.message.accountKeys.length ; i++) {
              pubkeys.push(result.transaction.transaction.message.accountKeys[i].pubkey);
            }
            for (let k = 0 ; k < priceAction.length ; k++) {
              if (checker >= 0 || pubkeys.includes(priceAction[k][0])) {
                if (checker >= 0) {
                  k = checker;
                } else {
                  console.log("checked for : ", priceAction[k][0]);
                  checker = k;
                  multiplier = mult / +priceAction[k][1];
                  charting.push(Math.round(+priceAction[k][1] * multiplier));
                }
                let sol = 0;
                let shitcoin = 0;
                let index = 0;
                for (let i = 0 ; i < result.transaction.meta.preTokenBalances.length ; i++) {
                  if (result.transaction.meta.preTokenBalances[i].mint == priceAction[k][3] && result.transaction.meta.preTokenBalances[i].owner == result.transaction.transaction.message.accountKeys[0].pubkey) {
                    index = result.transaction.meta.preTokenBalances[i].accountIndex;
                    shitcoin = result.transaction.meta.preTokenBalances[i].uiTokenAmount.uiAmount;
                  }
                }
                for (let i = 0 ; i < result.transaction.meta.postTokenBalances.length ; i++) {
                  if (result.transaction.meta.postTokenBalances[i].accountIndex == index) {
                    shitcoin = Math.abs(shitcoin - result.transaction.meta.postTokenBalances[i].uiTokenAmount.uiAmount);
                  }
                }
                for (let i = 0 ; i < result.transaction.meta.preTokenBalances.length ; i++) {
                  if (result.transaction.meta.preTokenBalances[i].mint == 'So11111111111111111111111111111111111111112') {
                    index = result.transaction.meta.preTokenBalances[i].accountIndex;
                    sol =  result.transaction.meta.preTokenBalances[i].uiTokenAmount.uiAmount;
                  }
                }
                for (let i = 0 ; i < result.transaction.meta.postTokenBalances.length ; i++) {
                  if (result.transaction.meta.postTokenBalances[i].accountIndex == index) {
                    sol = Math.abs(sol - result.transaction.meta.postTokenBalances[i].uiTokenAmount.uiAmount);
                  }
                }
                charting.push(Math.round((shitcoin / sol) * multiplier));
                console.log(charting);
                // let flush = "\n".repeat(50);
                // console.log(flush);
                // chart(charting, mult);
              }
              if (checker >= 0) {
                k = priceAction.length;
              }
            }
          }
        }
  } catch (e) {
      console.error('ws.on error :', e);
  }
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});