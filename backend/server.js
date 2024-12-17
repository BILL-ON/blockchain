// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

const authRoutes = require('./routes/authentification');
const rwaRoutes = require('./routes/rwa');
const buyofferRoutes = require('./routes/buyoffer');

const connectDatabase = require('./config/mgdb');
const { connectXRPL } = require('./config/xrplConnect'); // Update to return a promise
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rwa', rwaRoutes);
app.use('/api/rwa', buyofferRoutes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    await connectXRPL(); // Wait for XRPL connection
    console.log("All connections established");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app; // Export for testing
