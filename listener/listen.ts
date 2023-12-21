import { Connection, PublicKey, LAMPORTS_PER_SOL, } from "@solana/web3.js";
import { log } from "console";


const WSS_ENDPOINT = 'wss://cold-small-bridge.solana-mainnet.quiknode.pro/6a33be020e8e0198325b485591049affb92cc13b/';
const HTTP_ENDPOINT = 'https://cold-small-bridge.solana-mainnet.quiknode.pro/6a33be020e8e0198325b485591049affb92cc13b/';
const solanaConnection = new Connection(HTTP_ENDPOINT,{wsEndpoint:WSS_ENDPOINT});
const ACCOUNT_TO_WATCH = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');

// (async()=>{
//     const subscriptionId = await solanaConnection.onAccountChange(
//         ACCOUNT_TO_WATCH,
//         (updatedAccountInfo) =>
//             console.log(`---Event Notification for ${ACCOUNT_TO_WATCH.toString()}--- \nNew Account Balance:`, updatedAccountInfo.lamports / LAMPORTS_PER_SOL, ' SOL'),
//         "confirmed"
//     );
//     console.log('Starting web socket, subscription ID: ', subscriptionId);
// })()

const prefixesToCheck = [
    'Program ComputeBudget111111111111111111111111111111 invoke [1]',
    'Program ComputeBudget111111111111111111111111111111 success'
];

function printLogsStartWithAll(logs: string[], prefixes: string[]): void {
    for (const log of logs) {
      let currentIndex = 0;
  
      for (const prefix of prefixes) {
        if (log.startsWith(prefix, currentIndex)) {
          currentIndex += prefix.length;
        } else {
          return;
        }
      }
    }
    console.log(logs);
  }

(async()=>{
    const subscriptionId = await solanaConnection.onLogs(
        ACCOUNT_TO_WATCH,
        (updatedAccountInfo) =>
            printLogsStartWithAll(updatedAccountInfo.logs, prefixesToCheck),
            "confirmed"
        );
})()
