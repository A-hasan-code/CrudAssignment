const mongoose = require('mongoose');

const db_connection = () => {
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log(`Mongo connected with server: ${data.connection.host}`);
    }).catch(error => {
        console.error('MongoDB connection error:', error);
    });
}

module.exports = db_connection;
