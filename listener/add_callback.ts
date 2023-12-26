const fs = require("fs")
const api_key = JSON.parse(fs.readFileSync("/home/quarch/solana/listener/api_key.json").toString());
const webhook_url = JSON.parse(fs.readFileSync("/home/quarch/solana/listener/webhook_url.json").toString());
const RaydiumLiquidityPoolV4 = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const RaydiumAuthorityV4 = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";

const createTransactionCallback = async () => {
    try {
        const response = await fetch(
            "https://api.shyft.to/sol/v1/callback/create",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': api_key
                },
                body: JSON.stringify({
                    "network": "mainnet-beta",
                    "addresses": [
                        RaydiumAuthorityV4, RaydiumLiquidityPoolV4
                    ],
                    "callback_url": webhook_url,
                    "events": ["CREATE_POOL"],
                    "type": "CALLBACK",
                    "enable_raw": true,
                    "enable_events": true
                }),
            }
        );
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.error("callback creation error", e);
    }
}
createTransactionCallback();
