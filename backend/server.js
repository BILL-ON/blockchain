const express = require('express');
const cors = require('cors');
require('dotenv').config();

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')

const authRoutes = require('./routes/authentification');
const rwaRoutes = require('./routes/rwa');
const buyofferRoutes = require('./routes/buyoffer');

const connectDatabase = require('./config/mgdb');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rwa', rwaRoutes);
app.use('/api/rwa', buyofferRoutes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

app.get("/bozo", async (req, res) => {
  try {
    return res.status(200).json({
      "message": "toegbokki"
    });
  } catch (error) {
    console.error('Error when wallet created : ', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create wallet !'
    })
  }
})

// Start server
const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  console.log("Connected to Database")
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
