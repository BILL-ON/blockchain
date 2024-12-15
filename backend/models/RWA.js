const mongoose = require('mongoose');

const rwaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  valuation: {
    type: Number,
    required: true,
  },
  properties: {
    location: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    }
  },
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
rwaSchema.index({ walletAddress: 1 });

module.exports = mongoose.model('RWA', rwaSchema);
