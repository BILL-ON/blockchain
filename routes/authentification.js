const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const xrpl = require('xrpl')
const client = require('../config/xrplConnect');

router.post('/create-wallet', async (req, res) => {
    try {
        const wallet = xrpl.Wallet.generate();
        await client.fundWallet(wallet);

        const token = jwt.sign(
            { walletAddress: wallet.address },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        )

        res.json({
            success: true,
            wallet: {
                address: wallet.address,
                seed: wallet.seed,
                publicKey: wallet.publicKey
            },
            token
        })
    } catch(error) {
        console.error('Error when wallet created : ', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create wallet !'
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { seed } = req.body;

        if (!seed) {
            return res.status(400).json({
                success: false,
                error: 'Seed is missing!!!!!!!'
            })
        }

        const wallet = xrpl.Wallet.fromSeed(seed);

        const token = jwt.sign(
            { walletAddress: wallet.address },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            wallet: {
                address: wallet.address,
                publicKey: wallet.publicKey
            },
            token
        });
    } catch(error) {
        console.error('Login error : ', error);
        res.status('401').json({
            success: false,
            error: 'Invalid seed'
        })
    }
})

module.exports = router;
