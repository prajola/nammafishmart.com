import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COUPONS, money } from "../data";
import { useStore } from "../context/store";
import ProductImage from "../components/ProductImage";

export default function Cart() {
  const {
    cartProducts,
    setQty,
    remove,
    subtotal,
    discount,
    delivery,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    freeDeliveryLeft,
    user,
  } = useStore();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  if (cartProducts.length === 0) {
    return (
      <div className="grid place-items-center gap-3 py-24 text-center">
        <div className="text-7xl">🛒</div>
        <h1 className="text-2xl font-extrabold text-ink">Your cart is empty</h1>
        <p className="text-muted">Add some fresh catch to get started.</p>
        <Link
          to="/shop"
          className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-bold text-white shadow-lg"
        >
          Browse seafood →
        </Link>
      </div>
    );
  }

  const tryCoupon = () => {
    const res = applyCoupon(code);
    setErr(res.ok ? "" : res.message);
    if (res.ok) setCode("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-ink">Your Cart</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {freeDeliveryLeft > 0 && (
            <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
              🚚 You're {money(freeDeliveryLeft)} away from FREE delivery!
            </div>
          )}
          {cartProducts.map(({ product, qty }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-3 shadow-[var(--shadow-soft)]"
            >
              <Link to={`/product/${product.id}`}>
                <ProductImage
                  product={product}
                  className="h-24 w-24 shrink-0 rounded-xl"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/product/${product.id}`}>
                  <p className="font-bold text-ink hover:text-brand-600">
                    {product.name}
                  </p>
                </Link>
                <p className="text-xs text-muted">{product.unit}</p>
                <p className="mt-1 text-sm font-bold text-brand-700">
                  {money(product.price)}{" "}
                  <span className="text-xs font-normal text-muted line-through">
                    {money(product.mrp)}
                  </span>
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 rounded-full bg-brand-50 p-0.5 ring-1 ring-brand-200">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="grid h-8 w-8 place-items-center rounded-full text-brand-700 hover:bg-white"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-bold text-brand-700">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full text-brand-700 hover:bg-white"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-extrabold text-ink">
                    {money(product.price * qty)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => remove(product.id)}
                className="self-start text-muted hover:text-red-500"
                aria-label="Remove"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          {/* Coupon */}
          <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-[var(--shadow-soft)]">
            <p className="mb-2 font-bold text-ink">Have a coupon?</p>
            {coupon ? (
              <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2.5">
                <span className="text-sm font-bold text-green-700">
                  🎉 {coupon} applied
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setErr("");
                    }}
                    placeholder="Enter code"
                    className="min-w-0 flex-1 rounded-xl border border-brand-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-brand-400"
                  />
                  <button
                    onClick={tryCoupon}
                    className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    Apply
                  </button>
                </div>
                {err && <p className="mt-1.5 text-xs font-medium text-red-500">{err}</p>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(COUPONS).map(([c, v]) => (
                    <button
                      key={c}
                      onClick={() => {
                        const r = applyCoupon(c);
                        setErr(r.ok ? "" : r.message);
                      }}
                      className="rounded-lg border border-dashed border-brand-300 bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-700 hover:bg-brand-100"
                      title={v.label}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bill */}
          <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-[var(--shadow-soft)]">
            <p className="mb-3 font-bold text-ink">Bill details</p>
            <Row label="Item total" value={money(subtotal)} />
            {discount > 0 && (
              <Row label="Coupon discount" value={`− ${money(discount)}`} green />
            )}
            <Row
              label="Delivery fee"
              value={delivery === 0 ? "FREE" : money(delivery)}
              green={delivery === 0}
            />
            <div className="my-3 border-t border-dashed border-brand-200" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-ink">To pay</span>
              <span className="text-2xl font-extrabold text-brand-700">
                {money(total)}
              </span>
            </div>
            {discount > 0 && (
              <p className="mt-1 text-center text-xs font-bold text-green-600">
                You saved {money(discount)} on this order 🎉
              </p>
            )}
            <button
              onClick={() => nav("/checkout")}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-lg font-bold text-white shadow-lg shadow-brand-200 transition hover:scale-[1.02]"
            >
              {user ? "Proceed to checkout →" : "Login & checkout →"}
            </button>
            <p className="mt-2 text-center text-xs text-muted">
              🔒 Safe & secure checkout
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted">{label}</span>
      <span className={`font-bold ${green ? "text-green-600" : "text-ink"}`}>
        {value}
      </span>
    </div>
  );
}
