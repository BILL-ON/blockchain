// xrplConnect.js
const xrpl = require('xrpl');

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');

async function connectXRPL() {
  try {
    await client.connect();
    console.log("Connected to XRPL TESTNET!");
  } catch (err) {
    console.error("Failed to connect to XRPL:", err);
    throw err;
  }
}

module.exports = { client, connectXRPL };
