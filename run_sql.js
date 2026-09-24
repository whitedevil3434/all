import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSchema() {
  console.log("Attempting to run schema via RPC API...");
  
  // First check if the RPC function exists (it usually doesn't by default for arbitrary SQL)
  const sql = fs.readFileSync('supabase_schema.sql', 'utf8');
  
  // This will likely fail with anon key, but we can try if there's an arbitrary SQL execution endpoint open
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  
  if (error) {
    console.error("RPC Error:", error);
    console.log("\nNote: Supabase anon keys CANNOT execute raw SQL (CREATE TABLE, etc) for security reasons.");
  } else {
    console.log("Schema executed successfully:", data);
  }
}

runSchema();
