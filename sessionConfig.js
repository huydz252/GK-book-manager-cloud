// sessionConfig.js
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        // Lưu session vào DB dùng kết nối Ghi
        mongoUrl: process.env.MONGO_URI_WRITE,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 1 ngày
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
});

module.exports = sessionMiddleware;