const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const xrpl = require('xrpl')
const client = require('../config/xrplConnect');

router.post('/connect-wallet', async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters'
        });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { walletAddress: address },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.json({
        success: true,
        wallet: {
          address,
        },
        token
      });
    } catch (error) {
      console.error('Connection error: ', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect wallet'
      });
    }
  });
  

module.exports = router;
