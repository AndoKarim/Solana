import WebSocket from 'ws';
import axios from 'axios';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const ws = new WebSocket('wss://atlas-mainnet.helius-rpc.com?api-key=c1d1d8ca-636c-4bcf-a903-2d5dd45818c0');
const RaydiumLiquidityPoolV4 = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const RaydiumAuthorityV4 = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";
const TokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const AssociatedTokenAccountProgram = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
const Sage = "SAGEqqFewepDHH6hMDcmWy7yjHPpyKLDnRXKb3Ki8e6";
const SwitchBoardV2 = "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f";
const SysvarRent = "SysvarRent111111111111111111111111111111111";
const RentProgram = "11111111111111111111111111111111";
const Serum = "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX";
const expectedLogPatterns = [
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
    /^Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA [a-zA-Z0-9=]+$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
    /^Program 11111111111111111111111111111111 invoke \[3\]$/,
    /^Program 11111111111111111111111111111111 success$/,
    /^Program log: Initialize the associated token account$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[\d+\]$/,
    /^Program log: Instruction: InitializeImmutableOwner$/,
    /^Program log: Please upgrade to SPL Token 2022 for immutable owner support$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[\d+\]$/,
    /^Program log: Instruction: InitializeAccount3$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
    /^Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed \d+ of \d+ compute units$/,
    /^Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[\d+\]$/,
    /^Program log: Instruction: Transfer$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[\d+\]$/,
    /^Program log: Instruction: Transfer$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[\d+\]$/,
    /^Program log: Instruction: MintTo$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
    /^Program log: ray_log: .+$/,
    /^Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 consumed \d+ of \d+ compute units$/,
    /^Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 success$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke \[\d+\]$/,
    /^Program log: Instruction: CloseAccount$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed \d+ of \d+ compute units$/,
    /^Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success$/,
];
let counter = 0;
const accountsToWatch: string[] = [];
const labels = [
    'Market',
    'Request queue',
    'Event queue',
    'Bids',
    'Asks',
    'Base vault',
    'Quote vault',
    'Base mint',
    'Quote mint'
];
// const url = 'https://mainnet.helius-rpc.com/?api-key=cd855e6d-87db-449c-b018-82bc37940391';
const url = "https://api.mainnet-beta.solana.com";
const headers = {
    'Content-Type': 'application/json',
};

async function requestTransaction(signature: string) {
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
        console.log(response.data.result.transaction.message);
        // let iterLabels = response.data.result.transaction.message.instructions[5].accounts;
        // for (let i = 0; i < iterLabels.length - 1; i++) {
        //     console.log(`${labels[i].padEnd(15)} : ${response.data.result.transaction.message.accountKeys[iterLabels[i]]}`);
        // }
    } catch (error) {
        console.error('ERROR');
    }
}

requestTransaction("37QQwhsJTSaJoKVyHBbXvBBMTGBNoDEetjRMQyfegnuHGoT9WJUeMbLPmC4pEFU6ZBoPGmKZUp8FwG6RmihNnCkg");

// function sendRequest(ws: WebSocket) {
//     const request = {
//         jsonrpc: "2.0",
//         id: 420,
//         method: "transactionSubscribe",
//         params: [
//             {
//                 vote: false,
//                 failed: false,
//                 accountInclude: [],
//                 accountRequired: [],
//                 accountExclude: []
//             },
//             {
//                 commitment: "processed",
//                 encoding: "json",
//                 transaction_details: "full",
//                 showRewards: false,
//                 maxSupportedRransactionVersion: 0
//             }
//         ]
//     };
//     ws.send(JSON.stringify(request));
// }

// ws.on('open', function open() {
//     console.log('WebSocket is open\n');
//     sendRequest(ws);
// });

// function pauseFor(milliseconds: number): Promise<void> {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve();
//         }, milliseconds);
//     });
// }

// ws.on('message', async function incoming(data) {
//     const messageStr = data.toString('utf8');
//     try {
//         const messageObj = JSON.parse(messageStr);
//         if (messageObj.method === 'transactionNotification') {
//             const result = messageObj.params.result;
//             if (result && result.transaction) {
//                 const transactionObject = result.transaction;
//                 const logMessages = transactionObject.meta.logMessages;
//                 const signer = transactionObject.transaction.message.accountKeys[0];
//                 const isExpectedSequence = expectedLogPatterns.every((pattern, index) => pattern.test(logMessages[index]));
//                 if (isExpectedSequence) {
//                     let currentDate = new Date();
//                     let formattedTime = currentDate.toTimeString().slice(0, 8);
//                     counter += 1;
//                     console.log(`Transaction n°${counter}\nTime : ${formattedTime}\nSignature : ${result.signature}\nSigner : ${signer}\n\n`);
//                     accountsToWatch.push(signer);
//                     // const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner, true);
//                 } else if (accountsToWatch.includes(signer)){
//                     console.log(`\nNew transaction from watched account ${signer} : ${result.signature}\n\n`);
//                 }
//             }
//         }
//     } catch (e) {
//         console.error('Failed to parse JSON:', e);
//     }
// });

// ws.on('error', function error(err) {
//     console.error('WebSocket error:', err);
// });