const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

function connectDB() {
    mongoose
        .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
        .catch(e => {
            console.error('Connection error', e.message)
        })
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

module.exports = connectDB
