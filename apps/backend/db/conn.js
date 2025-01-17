import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionString);
let conn;

try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("video-streaming-db");
export default db;