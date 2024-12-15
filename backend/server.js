const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/mgdb')

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')

const authRoutes = require('./routes/authentification');
const rwaRoutes = require('./routes/rwa');

const app = express();

app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/rwa', rwaRoutes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
