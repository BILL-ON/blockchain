const xrpl = require('xrpl')

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
client.connect()
    .then(() => {
        console.log("Connected to XRPL TESTNET!!!!!");
    })
    .catch((err) => {
        console.error(err);
    })

module.exports = client;