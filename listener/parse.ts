const fs = require("fs")

const url = JSON.parse(fs.readFileSync("/home/quarch/solana/listener/rpc_helius.json").toString());
interface TransactionData {
  description: string;
  type: string;
  source: string;
  fee: number;
  // ... other properties ...
}
const parseTransaction = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactions: ["37QQwhsJTSaJoKVyHBbXvBBMTGBNoDEetjRMQyfegnuHGoT9WJUeMbLPmC4pEFU6ZBoPGmKZUp8FwG6RmihNnCkg"],
    }),
  });

  const data = (await response.json()) as TransactionData[];
  console.log(data[0].tokenTransfers);
};

parseTransaction();