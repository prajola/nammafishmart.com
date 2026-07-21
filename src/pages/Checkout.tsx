import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { money } from "../data";
import { useStore, type Order } from "../context/store";
import { useUI } from "../context/ui";

const SLOTS = [
  "Today · 4–6 PM",
  "Today · 6–8 PM",
  "Tomorrow · 7–9 AM",
  "Tomorrow · 11 AM–1 PM",
];
const PAYMENTS = [
  ["cod", "💵", "Cash / UPI on delivery"],
  ["upi", "📱", "UPI (GPay / PhonePe)"],
  ["card", "💳", "Credit / Debit card"],
];

export default function Checkout() {
  const {
    user,
    city,
    cartProducts,
    subtotal,
    discount,
    delivery,
    total,
    coupon,
    placeOrder,
    toast,
  } = useStore();
  const { openLogin } = useUI();
  const nav = useNavigate();

  const [placed, setPlaced] = useState<Order | null>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [line, setLine] = useState("");
  const [pin, setPin] = useState("");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [pay, setPay] = useState("cod");

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name);
      setPhone((p) => p || user.phone || "");
    }
  }, [user]);

  // Not logged in
  if (!user && !placed) {
    return (
      <Guard
        icon="🔐"
        title="Please login to checkout"
        text="Login to place your order and track deliveries."
        cta="Login now"
        onClick={openLogin}
      />
    );
  }
  // Empty cart (and no order just placed)
  if (cartProducts.length === 0 && !placed) {
    return (
      <Guard
        icon="🛒"
        title="Your cart is empty"
        text="Add some fresh catch before checking out."
        cta="Browse seafood"
        onClick={() => nav("/shop")}
      />
    );
  }

  // Success screen
  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="pop-in rounded-3xl border border-white/10 bg-navy-800 p-8 shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-green-100 text-5xl">
            ✅
          </div>
          <h1 className="text-2xl font-extrabold text-ink">Order confirmed!</h1>
          <p className="mt-1 text-muted">
            Thank you, {placed.address.name.split(" ")[0]}. Your fresh catch is on
            its way.
          </p>
          <div className="mt-5 rounded-2xl bg-white/5 p-4 text-left text-sm">
            <Row k="Order ID" v={placed.id} />
            <Row k="Delivery slot" v={placed.slot} />
            <Row k="Deliver to" v={`${placed.address.line}, ${placed.address.city}`} />
            <Row k="Amount" v={money(placed.total)} bold />
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              to="/orders"
              className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg"
            >
              Track order
            </Link>
            <Link
              to="/shop"
              className="flex-1 rounded-xl border border-white/15 bg-navy-800 py-3 font-bold text-brand-700 hover:bg-white/10"
            >
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !line || pin.length < 6) {
      toast("Please fill your delivery details.", "error");
      return;
    }
    const order = placeOrder({ name, phone, line, city, pin }, slot);
    toast(`Order ${order.id} placed! 🎉`, "success");
    setPlaced(order);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-ink">Checkout</h1>
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Address */}
          <Card title="📍 Delivery address">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Full name" value={name} onChange={setName} required />
              <Input label="Phone" value={phone} onChange={setPhone} required />
              <div className="sm:col-span-2">
                <Input
                  label="Flat / House, Street, Area"
                  value={line}
                  onChange={setLine}
                  required
                />
              </div>
              <Input label="City" value={city} onChange={() => {}} disabled />
              <Input
                label="Pincode"
                value={pin}
                onChange={(v) => setPin(v.replace(/\D/g, "").slice(0, 6))}
                required
              />
            </div>
          </Card>

          {/* Slot */}
          <Card title="🕑 Delivery slot">
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                    slot === s
                      ? "border-brand-500 bg-white/5 text-brand-700 ring-2 ring-brand-200"
                      : "border-white/10 text-ink hover:border-brand-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          {/* Payment */}
          <Card title="💳 Payment method">
            <div className="space-y-2">
              {PAYMENTS.map(([id, icon, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPay(id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    pay === id
                      ? "border-brand-500 bg-white/5 ring-2 ring-brand-200"
                      : "border-white/10 hover:border-brand-300"
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-ink">{label}</span>
                  <span className="ml-auto">{pay === id ? "🔵" : "⚪"}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-white/10 bg-navy-800 p-5 shadow-[var(--shadow-soft)]">
            <p className="mb-3 font-bold text-ink">
              Order summary ({cartProducts.length})
            </p>
            <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
              {cartProducts.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="truncate text-muted">
                    {product.name} × {qty}
                  </span>
                  <span className="font-bold text-ink">
                    {money(product.price * qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="my-3 border-t border-dashed border-white/15" />
            <Row2 k="Subtotal" v={money(subtotal)} />
            {discount > 0 && (
              <Row2 k={`Discount (${coupon})`} v={`− ${money(discount)}`} green />
            )}
            <Row2 k="Delivery" v={delivery === 0 ? "FREE" : money(delivery)} green={delivery === 0} />
            <div className="my-3 border-t border-dashed border-white/15" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-ink">To pay</span>
              <span className="text-2xl font-extrabold text-brand-700">
                {money(total)}
              </span>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]"
            >
              Place order · {money(total)}
            </button>
            <p className="mt-2 text-center text-xs text-muted">
              🔒 100% secure · Freshness guaranteed
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

/* ── small building blocks ── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800 p-5 shadow-[var(--shadow-soft)]">
      <h2 className="mb-3 font-bold text-ink">{title}</h2>
      {children}
    </div>
  );
}
function Input({
  label,
  value,
  onChange,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
      <input
        value={value}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-navy-800 focus:ring-2 focus:ring-brand-200 disabled:opacity-60"
      />
    </label>
  );
}
function Guard({
  icon,
  title,
  text,
  cta,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="grid place-items-center gap-3 py-24 text-center">
      <div className="text-7xl">{icon}</div>
      <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
      <p className="text-muted">{text}</p>
      <button
        onClick={onClick}
        className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-bold text-white shadow-lg"
      >
        {cta}
      </button>
    </div>
  );
}
function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted">{k}</span>
      <span className={bold ? "font-extrabold text-ink" : "font-semibold text-ink"}>
        {v}
      </span>
    </div>
  );
}
function Row2({ k, v, green }: { k: string; v: string; green?: boolean }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-muted">{k}</span>
      <span className={`font-bold ${green ? "text-green-600" : "text-ink"}`}>{v}</span>
    </div>
  );
}
