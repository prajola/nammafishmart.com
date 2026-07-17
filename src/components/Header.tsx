import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CITIES } from "../data";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";

export default function Header() {
  const { city, setCity, cartCount, user, logout } = useStore();
  const { openCart, openLogin } = useUI();
  const [q, setQ] = useState("");
  const [locOpen, setLocOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const nav = useNavigate();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 glass">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-lg shadow-md">
            🐟
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-ink">
              Namma<span className="text-brand-600">Fish</span>Mart
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted sm:block">
              Fresh from the coast
            </span>
          </span>
        </Link>

        {/* Location */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setLocOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm hover:border-brand-300"
          >
            <span>📍</span>
            <span className="font-semibold text-ink">{city}</span>
            <span className="text-muted">▾</span>
          </button>
          {locOpen && (
            <div className="pop-in absolute left-0 top-12 z-50 w-48 rounded-xl border border-brand-100 bg-white p-2 shadow-xl">
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase text-muted">
                Deliver to
              </p>
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    setLocOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-brand-50 ${
                    c === city ? "font-bold text-brand-600" : "text-ink"
                  }`}
                >
                  {c} {c === city && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <form onSubmit={search} className="relative hidden flex-1 sm:block">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search seer fish, prawns, crab…"
            className="w-full rounded-xl border border-brand-100 bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
        </form>

        <div className="flex items-center gap-1.5">
          <Link
            to="/shop"
            className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-ink hover:bg-brand-50 lg:block"
          >
            Shop
          </Link>

          {/* Account */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setAcctOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-2.5 py-2 text-sm hover:border-brand-300"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[80px] truncate font-semibold text-ink md:block">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
                {acctOpen && (
                  <div className="pop-in absolute right-0 top-12 z-50 w-44 rounded-xl border border-brand-100 bg-white p-2 shadow-xl">
                    <Link
                      to="/orders"
                      onClick={() => setAcctOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50"
                    >
                      📦 My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setAcctOpen(false);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                    >
                      ↪ Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={openLogin}
                className="rounded-xl border border-brand-200 bg-white px-3.5 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50"
              >
                Login
              </button>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-brand-200 transition hover:brightness-105"
          >
            🛒 <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-[11px] font-extrabold text-brand-900">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={search} className="relative px-4 pb-3 sm:hidden">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search fresh seafood…"
          className="w-full rounded-xl border border-brand-100 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400"
        />
        <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-muted">
          🔍
        </span>
      </form>
    </header>
  );
}
