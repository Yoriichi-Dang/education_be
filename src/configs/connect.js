require("dotenv").config();
const { MongoClient } = require("mongodb");
async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB);
  return { client, db };
}
module.exports = connectToDatabase;
