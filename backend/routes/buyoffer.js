const express = require('express');
const router = express.Router();
const xrpl = require('xrpl')
const client = require('../config/xrplConnect');
const authenticateToken = require('../middlewares/auth');
const RWA = require('../models/RWA');

router.post('/accept-buy-offer', authenticateToken, async (req, res) => {
    try {
        const { tokenId, walletOwnerBuyRequest } = req.body;

        if (!tokenId || !walletOwnerBuyRequest) {
            console.error("Missing fields!")
            res.status(400).json({
                error: "Missing fields"
            })
            return
        }

        // Update the RWA database record with the new owner (buyer's address)
        await RWA.findOneAndUpdate(
            { tokenId: tokenId },
            { walletAddress: walletOwnerBuyRequest },
            { new: true }
        );

        res.json({
            res: tokenId
        })
    } catch (error) {
        console.error("Error when accepting buy offer", error);
        res.status(500).json({
            error: error
        })
    }
});

router.post('/create-buy-offer', authenticateToken, async (req, res) => {
    try {
        const { 
            tokenId,      // NFT token ID
            amount,       // Amount to offer
            owner,        // Current owner of the NFT
            seed,         // Seed for wallet generation
            expiration    // Optional: expiration in days
        } = req.body;

        if (!tokenId || !amount || !owner || !seed) {
            console.error("Missing required fields!")
            res.status(400).json({
                error: "Missing required fields"
            })
            return
        }

        // Calculate expiration date if provided
        let expirationDate = null
        if (expiration) {
            let d = new Date()
            d.setDate(d.getDate() + parseInt(expiration))
            expirationDate = xrpl.isoTimeToRippleTime(d)
        }

        const wallet = xrpl.Wallet.fromSeed(seed);
        
        // Create the buy offer transaction
        const transactionBlob = {
            "TransactionType": "NFTokenCreateOffer",
            "Account": wallet.classicAddress,
            "Owner": owner,
            "NFTokenID": tokenId,
            "Amount": xrpl.xrpToDrops(amount),
            "Flags": null  // null for buy offer
        }

        // Add expiration if specified
        if (expirationDate) {
            transactionBlob.Expiration = expirationDate
        }

        // Submit the transaction
        const signedTx = await client.submitAndWait(transactionBlob, { wallet });

        if (signedTx.result.meta.TransactionResult === 'tesSUCCESS') {

            res.json({
                success: true,
                transaction: signedTx.result.meta.TransactionResult
            })
        } else {
            res.status(500).json({
                error: signedTx.result.meta.TransactionResult
            })
        }
    } catch (error) {
        console.error("Error creating buy offer:", error);
        res.status(500).json({
            error: "Failed to create buy offer"
        })
    }
});

router.post('/list-buy-offers', authenticateToken, async (req, res) => {
    try {
        const { tokenId } = req.body;

        if (!tokenId) {
            console.error("Missing token ID");
            return res.status(400).json({
                error: "Token ID is required"
            });
        }

        const nftBuyOffers = await client.request({
            method: "nft_buy_offers",
            nft_id: tokenId
        });

        res.json({
            success: true,
            offers: nftBuyOffers.result.offers,
        });

    } catch (error) {
        console.error("Empty:", error);
        res.status(200).json({
            success: false,
            offers: {}
        });
    }
});

router.post('/cancel-buy-offer', authenticateToken, async (req, res) => {
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
});

module.exports = router;