import { Link } from "react-router-dom";
import { money } from "../data";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";

const STEPS = ["Confirmed", "Packed", "Out for delivery", "Delivered"];

export default function Orders() {
  const { orders, user } = useStore();
  const { openLogin } = useUI();

  if (!user) {
    return (
      <div className="grid place-items-center gap-3 py-24 text-center">
        <div className="text-7xl">🔐</div>
        <h1 className="text-2xl font-extrabold text-ink">Login to see your orders</h1>
        <button
          onClick={openLogin}
          className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-bold text-white shadow-lg"
        >
          Login
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="grid place-items-center gap-3 py-24 text-center">
        <div className="text-7xl">📦</div>
        <h1 className="text-2xl font-extrabold text-ink">No orders yet</h1>
        <p className="text-muted">Your fresh-catch orders will show up here.</p>
        <Link
          to="/shop"
          className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-bold text-white shadow-lg"
        >
          Start shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-ink">My Orders</h1>
      <div className="space-y-5">
        {orders.map((o) => {
          // Demo progress: newest order sits early in the journey.
          const step = 1;
          return (
            <div
              key={o.id}
              className="overflow-hidden rounded-2xl border border-brand-100 bg-navy-800 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-100 bg-brand-50 px-5 py-3">
                <div>
                  <p className="font-extrabold text-ink">Order {o.id}</p>
                  <p className="text-xs text-muted">
                    {new Date(o.date).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {o.slot}
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {STEPS[step]}
                </span>
              </div>

              {/* progress */}
              <div className="px-5 pt-5">
                <div className="flex items-center">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-full text-sm ${
                            i <= step
                              ? "bg-brand-600 text-white"
                              : "bg-brand-100 text-brand-400"
                          }`}
                        >
                          {i <= step ? "✓" : i + 1}
                        </div>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`h-1 flex-1 rounded ${
                            i < step ? "bg-brand-600" : "bg-brand-100"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[10px] font-semibold text-muted">
                  {STEPS.map((s) => (
                    <span key={s} className="w-16 text-center first:text-left last:text-right">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* items */}
              <div className="px-5 py-4">
                <div className="space-y-1.5">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span className="text-ink">
                        {it.name} <span className="text-muted">× {it.qty}</span>
                      </span>
                      <span className="font-semibold text-ink">
                        {money(it.price * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-brand-200 pt-3">
                  <span className="text-sm text-muted">
                    Paid {o.coupon ? `· ${o.coupon} applied` : ""}
                  </span>
                  <span className="text-lg font-extrabold text-brand-700">
                    {money(o.total)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
