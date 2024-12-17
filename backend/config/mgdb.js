const mongoose = require('mongoose')
require('dotenv').config();

async function connectDatabase() {
    try {
        console.log("Environment Variables:");
        console.log(JSON.stringify(process.env, null, 2));

        const dburl = process.env.MONGODB_URI || "mongodb://mongo:27017/blockchain-database-mongo";

        console.log(`DB URI: ${dburl}`);
        await mongoose.connect(dburl);
        console.log('Connected to MongoDb !!');
    } catch (err) {
        console.error('Error when connecting to mongodb : ', err)
    }
}

module.exports = connectDatabase;
