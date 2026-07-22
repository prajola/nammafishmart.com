/**
 * Admin authentication + user (admin) management.
 *
 *   • Supabase mode → real email/password auth. Who is an admin is controlled
 *     by an `admins` allow-list table (RLS: only admins can edit it). A signed-in
 *     Supabase user only gets in if their email is on that list. Admins can
 *     invite other admins, revoke them, and send password-reset emails — all via
 *     client-SAFE Supabase flows (no service_role in the browser).
 *   • Local mode → a single passcode gate (VITE_ADMIN_PASSCODE, default "admin").
 *     There is no multi-user concept in local mode.
 *
 * NOTE: directly creating a user with a chosen password, or force-setting another
 * user's password, needs the service_role key and must run server-side (a Supabase
 * Edge Function). The email-based reset flow below is the secure standard and needs
 * no server. See ADMIN_SETUP.md.
 */
import { backend } from "./catalog";
import { getSupabase } from "./supabase";

const LOCAL_KEY = "nfm_admin_session";
const LOCAL_PASSCODE =
  (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined) || "admin";

export const usesEmailLogin = backend === "supabase";

export type AdminRow = {
  email: string;
  created_at?: string;
  invited_by?: string | null;
};

const adminRedirect = () =>
  `${location.origin}${import.meta.env.BASE_URL}admin`;

async function emailIsAdmin(email: string): Promise<boolean> {
  const sb = await getSupabase();
  const { data, error } = await sb
    .from("admins")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export async function currentEmail(): Promise<string | null> {
  if (backend !== "supabase") return null;
  const { data } = await (await getSupabase()).auth.getUser();
  return data.user?.email ?? null;
}

export async function isAuthed(): Promise<boolean> {
  if (backend === "supabase") {
    const sb = await getSupabase();
    const { data } = await sb.auth.getSession();
    const email = data.session?.user?.email;
    if (!email) return false;
    return emailIsAdmin(email);
  }
  return sessionStorage.getItem(LOCAL_KEY) === "1";
}

export async function signIn(email: string, password: string): Promise<void> {
  if (backend === "supabase") {
    const sb = await getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    const em = data.user?.email;
    if (!em || !(await emailIsAdmin(em))) {
      await sb.auth.signOut();
      throw new Error("This account isn't an admin. Ask an admin to invite you.");
    }
    return;
  }
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

// ─── Admin (user) management — Supabase only ───────────────────────────────
export async function listAdmins(): Promise<AdminRow[]> {
  const sb = await getSupabase();
  const { data, error } = await sb
    .from("admins")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AdminRow[];
}

/**
 * Invite someone as an admin: add their email to the allow-list and email them
 * a sign-in link (creates their account if new). They can set/reset a password
 * from the reset flow. Client-safe — no service_role.
 */
export async function inviteAdmin(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error("Enter a valid email.");
  const sb = await getSupabase();
  const me = await currentEmail();
  const { error } = await sb
    .from("admins")
    .upsert({ email: e, invited_by: me });
  if (error) throw error;
  const { error: e2 } = await sb.auth.signInWithOtp({
    email: e,
    options: { shouldCreateUser: true, emailRedirectTo: adminRedirect() },
  });
  if (e2) throw e2;
}

export async function revokeAdmin(email: string): Promise<void> {
  const sb = await getSupabase();
  const { error } = await sb
    .from("admins")
    .delete()
    .eq("email", email.toLowerCase());
  if (error) throw error;
}

/** Send a password-reset email to any user (secure standard flow). */
export async function sendPasswordReset(email: string): Promise<void> {
  const sb = await getSupabase();
  const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: adminRedirect(),
  });
  if (error) throw error;
}

// ─── Password recovery landing (from the reset email) ──────────────────────
export function isRecoverySession(): boolean {
  return (
    backend === "supabase" &&
    /(?:^|[#&?])type=recovery(?:&|$)/.test(window.location.hash)
  );
}

/** Update the signed-in (recovery) user's password to a new value. */
export async function updateMyPassword(password: string): Promise<void> {
  const sb = await getSupabase();
  const { error } = await sb.auth.updateUser({ password });
  if (error) throw error;
  // clear the recovery hash
  history.replaceState(null, "", location.pathname + location.search);
}
