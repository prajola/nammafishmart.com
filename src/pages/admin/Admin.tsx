import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/catalog";
import {
  deleteProduct,
  deleteCategory,
  resetLocalCatalog,
  seedSupabaseFromDemo,
  backend,
  type CatalogCategory,
  type CatalogProduct,
} from "../../lib/catalog";
import { money } from "../../data";
import {
  isAuthed,
  signIn,
  signOut,
  usesEmailLogin,
  isRecoverySession,
  updateMyPassword,
} from "../../lib/adminAuth";
import ProductImage from "../../components/ProductImage";
import ProductEditor from "./ProductEditor";
import CategoryEditor from "./CategoryEditor";
import UsersPanel from "./UsersPanel";

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [recovery, setRecovery] = useState(isRecoverySession());

  useEffect(() => {
    isAuthed().then(setAuthed);
  }, []);

  if (recovery) return <RecoveryForm onDone={() => setRecovery(false)} />;
  if (authed === null) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted">Loading…</div>
    );
  }
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Dashboard onSignOut={() => setAuthed(false)} />;
}

// ─── Password recovery (from the reset email link) ─────────────────────────
function RecoveryForm({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password.length < 6) return setErr("Password must be at least 6 characters.");
    if (password !== confirm) return setErr("Passwords don't match.");
    setBusy(true);
    try {
      await updateMyPassword(password);
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-400";

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
      <div className="w-full rounded-2xl border border-brand-100 bg-navy-800 p-6 shadow-xl">
        <h1 className="text-2xl font-extrabold text-ink">Set a new password</h1>
        {done ? (
          <>
            <p className="mt-2 text-sm text-green-400">
              Password updated. You can now sign in.
            </p>
            <button
              onClick={onDone}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white"
            >
              Continue to sign in
            </button>
          </>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className={field}
              autoComplete="new-password"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className={field}
              autoComplete="new-password"
            />
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white disabled:opacity-60"
            >
              {busy ? "Saving…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────
function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await signIn(email, password);
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-400";

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
      <form
        onSubmit={submit}
        className="w-full rounded-2xl border border-brand-100 bg-navy-800 p-6 shadow-xl"
      >
        <h1 className="text-2xl font-extrabold text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">
          {usesEmailLogin
            ? "Sign in with your admin email & password."
            : "Enter the admin passcode to manage the catalog."}
        </p>

        <div className="mt-5 space-y-3">
          {usesEmailLogin && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className={field}
              autoComplete="username"
            />
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={usesEmailLogin ? "Password" : "Passcode"}
            className={field}
            autoComplete="current-password"
          />
        </div>

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        <button
          disabled={busy}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link
          to="/"
          className="mt-3 block text-center text-sm font-semibold text-muted hover:text-brand-400"
        >
          ← Back to store
        </Link>
      </form>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const { products, categories } = useCatalog();
  const [tab, setTab] = useState<"products" | "categories" | "users">(
    "products"
  );
  const [editProduct, setEditProduct] = useState<CatalogProduct | null>(null);
  const [newProduct, setNewProduct] = useState(false);
  const [editCat, setEditCat] = useState<CatalogCategory | null>(null);
  const [newCat, setNewCat] = useState(false);

  async function onDeleteProduct(p: CatalogProduct) {
    if (confirm(`Delete “${p.name}”?`)) await deleteProduct(p.id);
  }
  async function onDeleteCategory(c: CatalogCategory) {
    const count = products.filter((p) => p.category === c.key).length;
    const msg = count
      ? `Delete category “${c.label}”? ${count} product(s) use it and will become uncategorised.`
      : `Delete category “${c.label}”?`;
    if (confirm(msg)) await deleteCategory(c.key);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Catalog admin</h1>
          <p className="mt-1 text-sm text-muted">
            {backend === "supabase" ? (
              <span className="text-green-400">
                ● Connected to Supabase — changes are live in production.
              </span>
            ) : (
              <span className="text-amber-400">
                ● Local preview mode — changes persist in this browser only.
                Configure Supabase for shared production data.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-xl border border-brand-200 px-4 py-2 text-sm font-bold text-ink hover:bg-brand-50"
          >
            View store
          </Link>
          <button
            onClick={async () => {
              await signOut();
              onSignOut();
            }}
            className="rounded-xl border border-brand-200 px-4 py-2 text-sm font-bold text-ink hover:bg-brand-50"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-brand-100">
        {(["products", "categories", "users"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-bold capitalize transition ${
              tab === t
                ? "border-brand-500 text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t}
            {t === "products" && ` (${products.length})`}
            {t === "categories" && ` (${categories.length})`}
          </button>
        ))}
      </div>

      {tab === "users" ? (
        <UsersPanel />
      ) : tab === "products" ? (
        <section className="mt-5">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setNewProduct(true)}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-bold text-white"
            >
              + New product
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-brand-100">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 border-b border-brand-100 bg-navy-800 p-3 last:border-0"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage product={p} className="h-12 w-12" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{p.name}</p>
                  <p className="truncate text-xs text-muted">
                    {catLabel(categories, p.category)} · {money(p.price)}
                    {p.soldOut && " · Out of stock"}
                  </p>
                </div>
                <button
                  onClick={() => setEditProduct(p)}
                  className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-bold text-ink hover:bg-brand-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteProduct(p)}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            ))}
            {products.length === 0 && (
              <p className="bg-navy-800 p-6 text-center text-sm text-muted">
                No products yet.
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="mt-5">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setNewCat(true)}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-bold text-white"
            >
              + New category
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.key}
                className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-navy-800 p-3"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-brand-100 bg-brand-50">
                  {c.img ? (
                    <img
                      src={
                        c.img.startsWith("data:") || c.img.startsWith("http")
                          ? c.img
                          : c.img
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">{c.emoji}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">
                    {c.emoji} {c.label}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {products.filter((p) => p.category === c.key).length}{" "}
                    products
                  </p>
                </div>
                <button
                  onClick={() => setEditCat(c)}
                  className="rounded-lg border border-brand-200 px-2.5 py-1.5 text-xs font-bold text-ink hover:bg-brand-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteCategory(c)}
                  className="rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10"
                >
                  Del
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {backend === "local" && (
        <button
          onClick={() => {
            if (confirm("Reset the catalog back to the original seed data?"))
              resetLocalCatalog();
          }}
          className="mt-8 text-xs font-semibold text-muted underline hover:text-red-400"
        >
          Reset to original demo catalog
        </button>
      )}

      {backend === "supabase" && (
        <div className="mt-8">
          {products.length === 0 && (
            <p className="mb-2 text-sm text-amber-400">
              Your Supabase catalog is empty. Import the demo products to get
              started, then edit from here.
            </p>
          )}
          <button
            onClick={async () => {
              if (
                confirm(
                  "Import the demo catalog into Supabase? Existing items with the same id/key are updated."
                )
              )
                try {
                  await seedSupabaseFromDemo();
                } catch (e) {
                  alert(e instanceof Error ? e.message : "Import failed");
                }
            }}
            className="text-xs font-semibold text-muted underline hover:text-brand-400"
          >
            Import demo catalog into Supabase
          </button>
        </div>
      )}

      {(newProduct || editProduct) && (
        <ProductEditor
          initial={editProduct}
          categories={categories}
          onClose={() => {
            setNewProduct(false);
            setEditProduct(null);
          }}
        />
      )}
      {(newCat || editCat) && (
        <CategoryEditor
          initial={editCat}
          onClose={() => {
            setNewCat(false);
            setEditCat(null);
          }}
        />
      )}
    </div>
  );
}

function catLabel(cats: CatalogCategory[], key: string) {
  return cats.find((c) => c.key === key)?.label ?? key ?? "—";
}
