const mongoose = require('mongoose')
require('dotenv').config();

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://mongo:27017/blockchain-database-mongo");
        console.log('Connected to MongoDb !!');
    } catch (err) {
        console.error('Error when connecting to mongodb : ', err)
    }
}

module.exports = connectDatabase;
