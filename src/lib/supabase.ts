/**
 * Optional Supabase client. The app works fully WITHOUT Supabase (it falls
 * back to a local, browser-only catalog). When these two env vars are set,
 * the catalog + admin portal persist to Supabase so edits made in the admin
 * portal reflect in production for every visitor.
 *
 *   VITE_SUPABASE_URL=https://<project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<anon public key>
 *
 * See ADMIN_SETUP.md for the one-time database + storage setup.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anon);

/** Storage bucket that holds uploaded product/category images. */
export const IMAGE_BUCKET = "catalog-images";

let clientPromise: Promise<SupabaseClient> | null = null;

/**
 * Lazily create the client. `@supabase/supabase-js` is dynamically imported so
 * it is NOT included in the main bundle — it only loads when a Supabase call
 * actually runs (i.e. when the backend is configured and used).
 */
export function getSupabase(): Promise<SupabaseClient> {
  if (!isSupabaseConfigured) {
    return Promise.reject(new Error("Supabase is not configured"));
  }
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(url as string, anon as string, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    );
  }
  return clientPromise;
}
