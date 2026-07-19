// db.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const dns = require('dns');


// Set Google DNS servers for this script's lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = 'mongodb+srv://nandanakumarama_db_user:GYXFk9R2JYin18sQ@cluster0.wq9pala.mongodb.net/?appName=Cluster0';

if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable. Set it in your .env file.');
}

const client = new MongoClient(uri);

let db = null;

// Connect once at startup. index.js calls this before app.listen().
async function connectDB() {
    if (db) return db;

    await client.connect();
    db = client.db('mydb'); // same db name used in seed.js
    console.log('Connected to MongoDB');
    return db;
}

// Used inside route handlers, after connectDB() has already resolved.
function getDB() {
    if (!db) {
        throw new Error('Database not initialized — call connectDB() before using getDB().');
    }
    return db;
}

async function closeDB() {
    await client.close();
    db = null;
}

module.exports = { connectDB, getDB, closeDB };