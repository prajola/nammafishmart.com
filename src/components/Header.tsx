import { useState } from "react";
import { Link } from "react-router-dom";
import { CITIES } from "../data";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";
import SearchBox from "./SearchBox";
import { LogoMark } from "./Logo";

export default function Header() {
  const { city, setCity, cartCount, user, logout } = useStore();
  const { openCart, openLogin } = useUI();
  const [locOpen, setLocOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-navy-800 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <LogoMark className="h-10 w-10" />
          <span className="leading-tight">
            <span className="block text-xl font-extrabold tracking-tight text-ink">
              Namma
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-brand-500">
              Fish Mart
            </span>
          </span>
        </Link>

        {/* Location */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setLocOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl border border-brand-100 bg-navy-800 px-3 py-2 text-sm hover:border-brand-300"
          >
            <span>📍</span>
            <span className="font-semibold text-ink">{city}</span>
            <span className="text-muted">▾</span>
          </button>
          {locOpen && (
            <div className="pop-in absolute left-0 top-12 z-50 w-48 rounded-xl border border-brand-100 bg-navy-800 p-2 shadow-xl">
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
        <div className="hidden flex-1 sm:block">
          <SearchBox />
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to="/shop"
            aria-label="Shop"
            title="Shop"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-ink hover:bg-brand-50 lg:flex"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9l1.5-5h15L21 9" />
              <path d="M3 9v11h18V9" />
              <path d="M3 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 3 0" />
              <path d="M9 20v-5h6v5" />
            </svg>
            Shop
          </Link>

          {/* Account */}
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setAcctOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-brand-100 bg-navy-800 px-2.5 py-2 text-sm hover:border-brand-300"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[80px] truncate font-semibold text-ink md:block">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
                {acctOpen && (
                  <div className="pop-in absolute right-0 top-12 z-50 w-44 rounded-xl border border-brand-100 bg-navy-800 p-2 shadow-xl">
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
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-ink hover:bg-brand-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
                </svg>
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={openCart}
            aria-label="Cart"
            title="Cart"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-ink hover:bg-brand-50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1.6" />
              <circle cx="18" cy="21" r="1.6" />
              <path d="M2 3h2.2l2.3 12.3a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L21 7H5.3" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand-500 px-1.5 text-xs font-extrabold text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 sm:hidden">
        <SearchBox placeholder="Search fresh seafood…" />
      </div>
    </header>
  );
}
