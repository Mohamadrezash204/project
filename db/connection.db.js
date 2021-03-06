const mongoose = require("mongoose");
const config = require("../config/config.js");
const { db: { host, port, name } } = config.development;
const connectionString = `mongodb://${host}:${port}/${name}`;
mongoose.connect(connectionString).catch(err => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => console.log('MongoDB connected'));
db.on('disconnected', () => console.log('MongoDB disconnected!'));
module.exports = db;