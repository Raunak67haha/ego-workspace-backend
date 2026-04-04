// middleware/auth.js
// ─────────────────────────────────────────────
// Reads the Bearer token from the Authorization header,
// verifies it with Supabase, and attaches req.user.
// All protected routes should use this middleware.
// ─────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Use the anon key here — this client is only used to verify user JWTs
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT with Supabase
    const { data, error } = await supabaseAuth.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach the verified user to req so controllers can use req.user.id
    req.user = data.user;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err.message);
    res.status(500).json({ error: 'Authentication error' });
  }
};
