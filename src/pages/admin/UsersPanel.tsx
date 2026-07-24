import { useEffect, useState } from "react";
import {
  listAdmins,
  inviteAdmin,
  revokeAdmin,
  sendPasswordReset,
  currentEmail,
  type AdminRow,
} from "../../lib/adminAuth";
import { backend } from "../../lib/catalog";

export default function UsersPanel() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );

  async function refresh() {
    setLoading(true);
    try {
      const [rows, m] = await Promise.all([listAdmins(), currentEmail()]);
      setAdmins(rows);
      setMe(m);
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Failed to load admins",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (backend === "supabase") void refresh();
    else setLoading(false);
  }, []);

  if (backend !== "supabase") {
    return (
      <div className="mt-5 rounded-2xl border border-brand-100 bg-navy-800 p-6">
        <p className="text-sm text-amber-400">
          Multi-user management needs Supabase. In local preview mode the admin
          is a single shared passcode.
        </p>
        <p className="mt-2 text-sm text-muted">
          Configure Supabase (see <code>ADMIN_SETUP.md</code>) to invite admins,
          manage roles, and send password resets.
        </p>
      </div>
    );
  }

  async function onInvite(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      await inviteAdmin(email);
      setMsg({
        kind: "ok",
        text: `Invited ${email.trim()} — they were emailed a sign-in link and can now access the admin.`,
      });
      setEmail("");
      await refresh();
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Invite failed",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onReset(target: string) {
    setMsg(null);
    try {
      await sendPasswordReset(target);
      setMsg({ kind: "ok", text: `Password-reset email sent to ${target}.` });
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Could not send reset",
      });
    }
  }

  async function onRevoke(target: string) {
    if (!confirm(`Revoke admin access for ${target}?`)) return;
    setMsg(null);
    try {
      await revokeAdmin(target);
      await refresh();
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Could not revoke",
      });
    }
  }

  const field =
    "w-full rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-400";

  return (
    <section className="mt-5 space-y-6">
      {/* Invite */}
      <div className="rounded-2xl border border-brand-100 bg-navy-800 p-5">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-muted">
          Invite an admin
        </h3>
        <form onSubmit={onInvite} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@email.com"
            className={field}
            required
          />
          <button
            disabled={busy}
            className="shrink-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? "Inviting…" : "Send invite"}
          </button>
        </form>
        <p className="mt-2 text-xs text-muted">
          Adds them to the admin allow-list and emails a sign-in link. They set
          their own password via the reset flow.
        </p>
      </div>

      {msg && (
        <p
          className={`text-sm ${
            msg.kind === "ok" ? "text-green-400" : "text-red-400"
          }`}
        >
          {msg.text}
        </p>
      )}

      {/* Admin list */}
      <div className="overflow-hidden rounded-2xl border border-brand-100">
        <div className="border-b border-brand-100 bg-navy-800 px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted">
          Admins ({admins.length})
        </div>
        {loading ? (
          <p className="bg-navy-800 p-6 text-center text-sm text-muted">Loading…</p>
        ) : admins.length === 0 ? (
          <p className="bg-navy-800 p-6 text-center text-sm text-muted">
            No admins yet.
          </p>
        ) : (
          admins.map((a) => (
            <div
              key={a.email}
              className="flex flex-wrap items-center gap-3 border-b border-brand-100 bg-navy-800 p-3 last:border-0"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-300">
                {a.email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">
                  {a.email}
                  {a.email === me?.toLowerCase() && (
                    <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase text-muted">
                      You
                    </span>
                  )}
                </p>
                {a.invited_by && (
                  <p className="truncate text-xs text-muted">
                    invited by {a.invited_by}
                  </p>
                )}
              </div>
              <button
                onClick={() => onReset(a.email)}
                className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-bold text-ink hover:bg-brand-50"
              >
                Reset password
              </button>
              <button
                onClick={() => onRevoke(a.email)}
                disabled={a.email === me?.toLowerCase()}
                title={
                  a.email === me?.toLowerCase()
                    ? "You can't revoke yourself"
                    : "Revoke admin"
                }
                className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-40"
              >
                Revoke
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
