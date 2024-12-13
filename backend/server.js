const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authentification');
const rwaRoutes = require('./routes/rwa');

app.use('/api/auth', authRoutes);
app.use('/api/rwa', rwaRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
