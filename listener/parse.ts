const url = "https://api.helius.xyz/v0/transactions/?api-key=cd855e6d-87db-449c-b018-82bc37940391";

const parseTransaction = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactions: ["3ChEgb7rNsYLFd5VAfimjoBx5whHnyEtiSACEKmy1Pks3jSjNfkdFz8xTHC231s8DZJn1UW4iy9Htyqc2YSGAniy"],
    }),
  });

  const data = await response.json();
  console.log(data);
};

parseTransaction();