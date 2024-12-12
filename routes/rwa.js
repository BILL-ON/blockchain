const express = require('express');
const router = express.Router();
const xrpl = require('xrpl')
const client = require('../config/xrplConnect');
const authenticateToken = require('../middlewares/auth');

router.post('/create', authenticateToken , async (req, res) => {
    try {
        const { name, description, valuation, location, size, seed } = req.body;
        const walletADdress = req.user.walletAddress;
        
        const metadata = {
            name,
            description,
            valuation,
            properties: {
                location,
                size
            },
            createdAt: new Date().toISOString()
        }

        const tokenTx = {
            TransactionType: "NFTokenMint",
            Account: walletADdress,
            NFTokenTaxon: 0,
            Flags: 8,
            URI: xrpl.convertStringToHex(JSON.stringify(metadata))
        }

        const wallet = xrpl.Wallet.fromSeed(seed);
        const signedTx = await client.submitAndWait(tokenTx, { wallet });

        res.json({
            tokenId: signedTx.result.TokenID,
            metadata
        });
    } catch (error) {
        console.error('RWA creation error : ', error)
        res.status(500).json({
            error: 'Creation failed'
        })
    }
})

router.get('/my-assets', authenticateToken, async (req, res) => {
    try {
        const rwas = await client.request({
            command: 'account_nfts',
            account: req.user.walletAddress
        });

        const assets = rwas.result.account_nfts.map(nft => {
            try {
                if (!nft.URI) {
                    return {
                        tokenId: nft.NFTokenID,
                        error: 'No URI FOUNDDD!'
                    }
                }

                const decoded = Buffer.from(nft.URI, 'hex').toString('utf8');
                const metadata = JSON.parse(decoded);

                return {
                    tokenId: nft.NFTokenID,
                    ...metadata
                }
            } catch (e) {
                return {
                    tokenId: NFTokenID,
                    error: 'Failed to decode metadata : ' + e.message
                }
            }
        })

        res.json({
            assets
        })

    } catch (error) {
        console.error('Error when fetching assets: ', error);
        res.status(500).json({
            error: 'Failed to fetch assets'
        })
    }
})

module.exports = router;