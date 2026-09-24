import { Client } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("Error: DATABASE_URL is not set.");
  process.exit(1);
}

async function runSchema() {
  console.log("Connecting to PostgreSQL database...");
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false } // Required for Supabase connection
  });

  try {
    await client.connect();
    console.log("Connected successfully.");
    
    console.log("Reading schema file...");
    const sql = fs.readFileSync('supabase_schema.sql', 'utf8');
    
    console.log("Executing schema...");
    await client.query(sql);
    console.log("Schema execution completed successfully!");
    
  } catch (err) {
    console.error("Database connection or execution error:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

runSchema();
