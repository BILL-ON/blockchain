const express = require('express');
const router = express.Router();
const RWA = require('../models/RWA');

router.post('/create', async (req, res) => {
  try {
    const { name, description, valuation, location, size, tokenId, walletAddress } = req.body;

    if (!name) return res.status(404).json({ "error": "missing name" });
    if (!description) return res.status(404).json({ "error": "missing description" });
    if (!valuation) return res.status(404).json({ "error": "missing valuation" });
    if (!location) return res.status(404).json({ "error": "missing location" });
    if (!size) return res.status(404).json({ "error": "missing size" });
    if (!tokenId) return res.status(404).json({ "error": "missing tokenId" });
    if (!walletAddress) return res.status(404).json({ "error": "missing walletAddress" });

    const newRWA = new RWA({
      name,
      description,
      valuation,
      properties: {
        location,
        size
      },
      tokenId: tokenId,
      walletAddress
    });

    await newRWA.save();

    return res.status(201).json({
      "message": "RWA created successfully",
      "RWA": newRWA
    });

  } catch (error) {
    console.error('RWA creation error : ', error)
    res.status(500).json({
      error: 'Creation failed'
    })
  }
});

router.get('/', async (req, res) => {
  try {
    const id = req.query.tokenId;

    if (id == null) {
      const rwa = await RWA.find({});

      return res.status(201).json({ "message": "RWA retrieved successfuly", "RWA": rwa });
    } else {
      const rwa = await RWA.findOne({ tokenId: id });

      if (!rwa) {
        return res.status(404).json({ "error": `no RWA found for id ${id}` });
      } else {
        return res.status(201).json({ "message": "RWA retrieved successfuly", "RWA": rwa });
      }
    }
  } catch (error) {
    console.error('RWA fetching error : ', error)
    res.status(500).json({
      error: 'Fetching failed'
    })
  }
})

router.delete('/', async (req, res) => {
  try {
    const id = req.query.tokenId;

    if (id == null) {
      const rwa = await RWA.deleteMany({});

      return res.status(200).json({ "message": "RWA deleted successfuly", "RWA": rwa });
    } else {
      const rwa = await RWA.deleteOne({ tokenId: id });

      if (!rwa) {
        return res.status(404).json({ "error": `no RWA found for id ${id}` });
      } else {
        return res.status(200).json({ "message": "RWA deleted successfuly", "RWA": rwa });
      }
    }
  } catch (error) {
    console.error('RWA deletion error : ', error)
    res.status(500).json({
      error: 'deletion failed'
    })
  }
});

module.exports = router;