import WebSocket from 'ws';

//Replace XXXX by your key 
const ws = new WebSocket('wss://atlas-mainnet.helius-rpc.com?api-key=XXXX');

function sendRequest(ws: WebSocket) {
    const request = {
        jsonrpc: "2.0",
        id: 420,
        method: "accountSubscribe",
        params: [
            "HT4Rqhskg2xiBFVJV1kB19jMbSPdEfgRWpepSx6XoYi",
            {
                encoding: "jsonParsed",
                commitment: "confirmed",
            }
        ]
    };
    ws.send(JSON.stringify(request));
}

ws.on('open', function open() {
    console.log('WebSocket is open');
    sendRequest(ws);
});

ws.on('message', function incoming(data) {
    const messageStr = data.toString('utf8');
    try {
        const messageObj = JSON.parse(messageStr);
        if (messageObj.params && messageObj.params.result) {
            console.log(messageObj.params.result.value.data);
        }
    } catch (e) {
        console.error('Failed to parse JSON:', e);
    }
});

ws.on('error', function error(err) {    
    console.error('WebSocket error:', err);
});

ws.on('close', function close() {
    console.log('WebSocket is closed');
});
