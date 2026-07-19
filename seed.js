// seed.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const dns = require('dns');


// Set Google DNS servers for this script's lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function seed() {
  const client = new MongoClient('mongodb+srv://nandanakumarama_db_user:GYXFk9R2JYin18sQ@cluster0.wq9pala.mongodb.net/?appName=Cluster0');
  try {
    await client.connect();
    const db = client.db('mydb');

    const data = JSON.parse(fs.readFileSync('./seed.json', 'utf-8'));

    for (const [collectionName, documents] of Object.entries(data)) {
      const collection = db.collection(collectionName);
      await collection.deleteMany({}); // optional: clear old data first
      const result = await collection.insertMany(documents);
      console.log(`✅ ${collectionName}: inserted ${result.insertedCount} documents`);
    }
  } finally {
    await client.close();
  }
}

seed().catch(console.error);