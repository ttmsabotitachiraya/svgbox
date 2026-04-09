import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Always keep the session alive by automatically refreshing the JWT
    // before it expires.  This is the primary defence against the
    // "tab was idle → JWT expired → every request fails" freeze.
    autoRefreshToken: true,

    // Persist the session in localStorage so that a hard refresh or a new
    // tab opened from the same origin still has a valid session without
    // requiring the user to log in again.
    persistSession: true,

    // Parse the access_token / refresh_token from the URL hash after an
    // OAuth or magic-link redirect.  Safe to leave on even if you only use
    // email+password auth — it's a no-op when the hash is absent.
    detectSessionInUrl: true,
  },
});
