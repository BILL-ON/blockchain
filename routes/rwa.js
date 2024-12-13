const express = require('express');
const router = express.Router();
const xrpl = require('xrpl')
const client = require('../config/xrplConnect');
const authenticateToken = require('../middlewares/auth');

router.post('/create', authenticateToken , async (req, res) => {
    try {
        const { name, description, valuation, location, size, seed } = req.body;
        const walletADdress = req.user.walletAddress;

        if ( !name || !description || !valuation || !location || !size || !seed) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }
        
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

router.post('/create-sell-offer', authenticateToken, async (req, res) => {
    try {

        const { tokenID, amount, seed } = req.body;
        const walletAddress = req.user.walletAddress;

        if ( !tokenID || !amount || !seed || !walletAddress) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }
        
        const sellOfferTx = {
            TransactionType: "NFTokenCreateOffer",
            Account: walletAddress,
            NFTokenID: tokenID,
            Amount: amount,
            Flags: 1
        };

        const wallet = xrpl.Wallet.fromSeed(seed);
        const signedTx = await client.submitAndWait(sellOfferTx, { wallet });

        res.json({
            offerID: signedTx.result.offer_id,
            transaction: signedTx.result
        })
    } catch (error) {
        console.error("ERROR when offer was created: ", error);
        res.status(500).json({
            error: "Failed to create sell offer"
        })
    }
})

router.post('/list-sell-offers', authenticateToken, async (req, res) => {
    try {
        const { tokenID } = req.body;

        if ( !tokenID) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }

        rwaselloffers = await client.request({
            method: "nft_sell_offers",
            nft_id: tokenID
        })

        res.json({
            RWAselloffers: rwaselloffers
        });

    } catch (error) {
        console.log("NO sell offers for you nfttttt !")
        res.status(200).json({
            msg: "no sell offers!!"
        })
    }
})

router.post('/accept-sell-offer', authenticateToken , async (req, res) => {
    try {

        const { nft_offer_index, seed } = req.body;
        const walletAddress = req.user.walletAddress;

        if ( !nft_offer_index || !seed) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }

        
        const acceptSellOfferTx = {
            TransactionType: "NFTokenAcceptOffer",
            Account: walletAddress,
            NFTokenSellOffer: nft_offer_index
        }

        const wallet = xrpl.Wallet.fromSeed(seed);
        const signedTx = await client.submitAndWait(acceptSellOfferTx, { wallet });
        res.json({
            res: JSON.stringify(signedTx.result.meta.TransactionResult, null, 2)
        })
    } catch (error) {
        console.error("Error when accepting sell offer", error);
        res.status(500).json({
            error: error
        })
    }

})


router.post('/cancel-sell-offer', authenticateToken, async (req, res) => {
    try {

        const { tokenOfferId, seed } = req.body;

        if ( !tokenOfferId) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }
        const wallet = xrpl.Wallet.fromSeed(seed);
        
        const cancelOfferTx = {
            TransactionType: "NFTokenCancelOffer",
            Account: wallet.classicAddress,
            NFTokenOffers: [tokenOfferId],
        };

        const response = await client.submitAndWait(cancelOfferTx, { wallet });

        console.log

        res.json({
            success: true,
            transaction: response.result.meta.TransactionResult
        })
    } catch (error) {
        console.error("ERROR when offer was cancelled: ", error);
        res.status(500).json({
            error: "Failed to cancel offer"
        })
    }
})


module.exports = router;