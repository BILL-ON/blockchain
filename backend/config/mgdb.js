const mongoose = require('mongoose')
require('dotenv').config();
const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDb !!');
    } catch (err) {
        console.error('Error when connecting to mongodb : ', err)
    }
}
connectDatabase();