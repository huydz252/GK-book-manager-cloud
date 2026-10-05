// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const readConnection = mongoose.createConnection(process.env.MONGO_URI_READ);
readConnection.on('connected', () => console.log('MongoDB Read Connected'));

const writeConnection = mongoose.createConnection(process.env.MONGO_URI_WRITE);
writeConnection.on('connected', () => console.log('MongoDB Write Connected'));

const BookSchema = new mongoose.Schema({
    bookCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    basePrice: { type: Number, required: true },
    vatRate: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const BookReadModel = readConnection.model('Book', BookSchema);
const BookWriteModel = writeConnection.model('Book', BookSchema);

module.exports = {
    readConnection,
    writeConnection,
    BookReadModel,
    BookWriteModel
};