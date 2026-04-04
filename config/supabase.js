// config/supabase.js
// ─────────────────────────────────────────────
// Supabase backend client — uses service role key
// so it can bypass RLS and operate as a trusted server.
// NEVER expose the service role key to the frontend.
// ─────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

// Service role client — full DB access, bypasses RLS
// We manually scope all queries using user_id from the verified token
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
