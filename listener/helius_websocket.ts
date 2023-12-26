import WebSocket from 'ws';
import axios from 'axios';
const fs = require("fs")

const wss_helius = JSON.parse(fs.readFileSync("/home/quarch/solana/listener/wss_helius.json").toString());
// const url = JSON.parse(fs.readFileSync("/home/quarch/solana/listener/rpc_helius.json").toString());
const url = "https://api.mainnet-beta.solana.com";
const ws = new WebSocket(wss_helius);
const RaydiumAuthorityV4 = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";
const Serum = "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX";
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
const headers = {
    'Content-Type': 'application/json',
};
const marketId: string[] = [];

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
        marketId.push(response.data.result.transaction.message.accountKeys[response.data.result.transaction.message.instructions[5].accounts[0]]);
        // let iterLabels = response.data.result.transaction.message.instructions[5].accounts;
        // for (let i = 0; i < iterLabels.length - 1; i++) {
        //     console.log(`${labels[i].padEnd(15)} : ${response.data.result.transaction.message.accountKeys[iterLabels[i]]}`);
        // }
    } catch (error) {
        console.error('ERROR');
    }
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
                // signature: "",
                accountInclude: [],
                accountRequired: [],
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

function areRegexPatternsContained(regexPatterns: RegExp[], stringList: string[]): boolean {
    let regexIndex = 0;
    let check = false;
    for (const str of stringList) {
        if (regexPatterns[regexIndex].test(str)) {
            regexIndex++;
            check = true;
        }
        else if (check) {
            return false;
        }
        if (regexIndex === regexPatterns.length) {
            return true;
        }
    }
    return false;
}

ws.on('open', function open() {
    console.log('WebSocket is open\n');
    sendRequest(ws);
});

ws.on('message', async function incoming(data) {
    const messageStr = data.toString('utf8');
    try {
        const messageObj = JSON.parse(messageStr);
        if (messageObj.method === 'transactionNotification') {
            const result = messageObj.params.result;
            if (result && result.transaction && result.transaction.transaction && result.transaction.transaction.message) {
                if (marketId.length > 0) {
                    for (let marketIndex = 0 ; marketIndex < marketId.length ; marketIndex++) {
                        const checkAccounts = [RaydiumAuthorityV4, Serum, marketId[marketIndex]];
                        let pubkeys: string[] = [];
                        for (let i = 0 ; i < result.transaction.transaction.message.accountKeys.length ; i++) {
                            pubkeys.push(result.transaction.transaction.message.accountKeys[i].pubkey);
                        }
                        if (checkAccounts.every(item => pubkeys.includes(item))) {
                            console.log(`!!! POOL OPENED FOR ${marketId[marketIndex]}\nFirst swap : ${result.signature}\nPubkeys method !!!`);
                            marketId.splice(marketIndex, 1);
                        }
                        if (result.transaction.transaction.message.instructions[0]) {
                            for (let i = 0 ; i < result.transaction.transaction.message.instructions.length ; i++) {
                                if (result.transaction.transaction.message.instructions[i].accounts && result.transaction.transaction.message.instructions[i].accounts[0]) {
                                    let accounts: string[] = result.transaction.transaction.message.instructions[i].accounts;
                                    if (checkAccounts.every(item => accounts.includes(item))) {
                                        console.log(`!!! POOL OPENED FOR ${marketId[marketIndex]}\nFirst swap : ${result.signature}\nAccounts method !!!`);
                                        marketId.splice(marketIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                }
                const transactionObject = result.transaction;
                const logMessages = transactionObject.meta.logMessages;
                const signer = transactionObject.transaction.message.accountKeys[0].pubkey;
                const isExpectedSequence = expectedLogPatternsSerumMarket.every((pattern, index) => pattern.test(logMessages[index]));
                if (isExpectedSequence) {
                    let currentDate = new Date();
                    let formattedTime = currentDate.toTimeString().slice(0, 8);
                    counter += 1;
                    let market = result.transaction.transaction.message.instructions[5].accounts[0];
                    marketId.push(market);
                    console.log(`Transaction n°${counter}\nTime : ${formattedTime}\nSignature : ${result.signature}\nSigner : ${signer}\nMarket ID : ${market}\n\n`);
                }
            }
        }
    } catch (e) {
        console.error('Failed to parse JSON:', e);
    }
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});