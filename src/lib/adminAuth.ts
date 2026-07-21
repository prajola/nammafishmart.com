/**
 * Admin authentication.
 *   • Supabase mode → real email/password auth (Supabase Auth). Only users you
 *     create in the Supabase dashboard can sign in, and RLS on the tables means
 *     only authenticated users can write. This is production-safe.
 *   • Local mode   → a passcode gate (VITE_ADMIN_PASSCODE, default "admin").
 *     This is NOT real security — it only gates the preview admin on this
 *     browser. Configure Supabase for a real, shared, secured backend.
 */
import { backend } from "./catalog";
import { getSupabase } from "./supabase";

const LOCAL_KEY = "nfm_admin_session";
const LOCAL_PASSCODE =
  (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined) || "admin";

export async function isAuthed(): Promise<boolean> {
  if (backend === "supabase") {
    const { data } = await (await getSupabase()).auth.getSession();
    return Boolean(data.session);
  }
  return sessionStorage.getItem(LOCAL_KEY) === "1";
}

export async function signIn(email: string, password: string): Promise<void> {
  if (backend === "supabase") {
    const { error } = await (await getSupabase()).auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return;
  }
  // local mode: the "password" field is the passcode; email is ignored
  if (password !== LOCAL_PASSCODE) {
    throw new Error("Incorrect passcode");
  }
  sessionStorage.setItem(LOCAL_KEY, "1");
}

export async function signOut(): Promise<void> {
  if (backend === "supabase") {
    await (await getSupabase()).auth.signOut();
    return;
  }
  sessionStorage.removeItem(LOCAL_KEY);
}

export const usesEmailLogin = backend === "supabase";
