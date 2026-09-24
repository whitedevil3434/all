import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY is not set.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runSchema() {
  console.log("Running schema migration via Admin client...");
  
  const sql = fs.readFileSync('supabase_schema.sql', 'utf8');
  
  // NOTE: Even with the service_role key, Supabase REST API does not have an endpoint 
  // to execute raw SQL directly unless a custom RPC function like 'exec_sql' exists.
  // BUT we can use the postgres connection string if available, or try RPC anyway 
  // to see if they enabled it. Let's try RPC first.
  
  const { data, error } = await supabaseAdmin.rpc('exec_sql', { query: sql });
  
  if (error) {
    console.error("RPC Error:", error.message);
    console.log("We need to use the pg library and a Postgres Connection String to run raw SQL.");
    console.log("Installing pg library...");
  } else {
    console.log("Schema executed successfully:", data);
  }
}

runSchema();
