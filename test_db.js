import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing Supabase connection...");
  const { data, error } = await supabase.from('reality_contexts').select('*').limit(1);
  if (error) {
    console.error("Connection error:", error);
  } else {
    console.log("Connection successful! Found data:", data);
  }
}

testConnection();
