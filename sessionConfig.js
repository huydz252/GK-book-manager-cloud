// sessionConfig.js
let session = require('express-session');
let connectMongo = require('connect-mongo');
require('dotenv').config();

// Đảm bảo lấy đúng hàm khởi tạo session dù là CommonJS hay ES Module
if (session && session.default) {
    session = session.default;
}

// Xử lý lấy đúng MongoStore
let MongoStore = connectMongo;
if (connectMongo && connectMongo.default) {
    MongoStore = connectMongo.default;
}

let store;
if (typeof MongoStore.create === 'function') {
    store = MongoStore.create({
        mongoUrl: process.env.MONGO_URI_WRITE,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    });
} else if (typeof MongoStore === 'function') {
    const SessionStore = MongoStore(session);
    store = new SessionStore({
        url: process.env.MONGO_URI_WRITE,
        collection: 'sessions',
        ttl: 24 * 60 * 60
    });
}

// Tạo middleware session
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
});

module.exports = sessionMiddleware;