const express = require('express');
const router = express.Router();
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

module.exports = router;