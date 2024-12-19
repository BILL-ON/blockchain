const express = require('express');
const router = express.Router();
const xrpl = require('xrpl')
const client = require('../config/xrplConnect');
const authenticateToken = require('../middlewares/auth');
const RWA = require('../models/RWA');

router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { name, description, valuation, location, size, nftId } = req.body;
        const walletAddress = req.user.walletAddress.result.address;

        if (!name || !description || !valuation || !location || !size) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }
        const newRWA = new RWA({
            name,
            description,
            valuation,
            properties: {
                location,
                size
            },
            tokenId: nftId,
            walletAddress
        })

        await newRWA.save();

        res.json({
            tokenId: nftId,
        });
    } catch (error) {
        console.error('RWA creation error : ', error)
        res.status(500).json({
            error: 'Creation failed'
        })
    }
})

// ALL EXCEPT HIS OWN
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const walletAddress = req.user.walletAddress;
        // Using $ne (not equal) to exclude the user's own RWAs
        const rwaList = await RWA.find({ walletAddress: { $ne: walletAddress } });
        res.json(rwaList);
    } catch (error) {
        console.error('Error fetching RWAs:', error);
        res.status(500).json({ error: 'Failed to fetch RWAs' });
    }
});

router.delete('/delete-rwa', authenticateToken, async (req, res) => {
    try {
        const { tokenId, seed } = req.body;
        const walletAddress = req.user.walletAddress;

        if (!tokenId || !seed || !walletAddress) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }

        const tokenTx = {
            TransactionType: 'NFTokenBurn',
            Account: walletAddress,
            NFTokenID: tokenId
        };

        const wallet = xrpl.Wallet.fromSeed(seed);
        const signedTx = await client.submitAndWait(tokenTx, { wallet });

        if (signedTx.result.meta.TransactionResult === 'tesSUCCESS') {
            try {
                await RWA.deleteOne({ tokenId: tokenId });
            } catch (dbError) {
                console.log('Database deletion failed:', dbError);
            }

            res.json({
                tokenId: tokenId,
                transaction: signedTx.result.meta.TransactionResult
            })
        } else {
            res.status(500).json({
                error: signedTx.result.meta.TransactionResult
            })
        }
    } catch (error) {
        console.error("ERROR when deleting token: ", error);
        res.status(500).json({
            error: "Failed to delete token"
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

        if (!tokenID || !amount || !seed || !walletAddress) {
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
            Amount: xrpl.xrpToDrops(amount),
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

        if (!tokenID) {
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
            RWAselloffers: rwaselloffers.result.offers,
            TokenID: rwaselloffers.result.nft_id
        });

    } catch (error) {
        console.log("NO sell offers for you nfttttt !")
        res.status(200).json({
            msg: "no sell offers!!"
        })
    }
})

router.post('/accept-sell-offer', authenticateToken, async (req, res) => {
    try {

        const { nft_offer_index, seed } = req.body;
        const walletAddress = req.user.walletAddress;

        if (!nft_offer_index || !seed) {
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

        if (signedTx.result.meta.TransactionResult === 'tesSUCCESS') {
            try {
                await RWA.findOneAndUpdate(
                    { tokenId: signedTx.result.meta.nftoken_id }, // Find by tokenId
                    { walletAddress: walletAddress }, // Update owner to buyer's address
                    { new: true }
                );
            } catch (dbError) {
                console.log('Database update failed:', dbError);
            }
            res.json({
                res: signedTx.result.meta.TransactionResult
            })
        } else {
            res.status(500).json({
                error: signedTx.result.meta.TransactionResult
            })
        }

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

        if (!tokenOfferId) {
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


        if (response.result.meta.TransactionResult === 'tesSUCCESS') {
            res.json({
                success: true,
                transaction: response.result.meta.TransactionResult
            })
        } else {
            res.status(500).json({
                error: response.result.meta.TransactionResult
            })
        }

    } catch (error) {
        console.error("ERROR when offer was cancelled: ", error);
        res.status(500).json({
            error: "Failed to cancel offer"
        })
    }
})


module.exports = router;