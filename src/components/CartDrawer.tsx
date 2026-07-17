import { Link } from "react-router-dom";
import { money } from "../data";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";
import ProductArt from "./ProductArt";
import { PRODUCTS } from "../data";

export default function CartDrawer() {
  const { cartProducts, setQty, remove, subtotal, freeDeliveryLeft } = useStore();
  const { cartOpen, closeCart } = useUI();

  return (
    <div
      className={`fixed inset-0 z-[80] ${cartOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!cartOpen}
    >
      <div
        className={`absolute inset-0 bg-brand-900/40 backdrop-blur-sm transition-opacity ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-[min(92vw,420px)] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <h2 className="text-lg font-extrabold text-ink">
            Your Cart{" "}
            <span className="text-sm font-medium text-muted">
              ({cartProducts.length})
            </span>
          </h2>
          <button
            onClick={closeCart}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-brand-50"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {freeDeliveryLeft > 0 && subtotal > 0 && (
          <div className="bg-brand-50 px-5 py-2.5 text-center text-xs font-semibold text-brand-700">
            Add {money(freeDeliveryLeft)} more for FREE delivery 🚚
          </div>
        )}

        {cartProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="text-6xl">🛒</div>
            <p className="font-semibold text-ink">Your cart is empty</p>
            <p className="text-sm text-muted">Fresh catch is just a tap away.</p>
            <Link
              to="/shop"
              onClick={closeCart}
              className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 font-bold text-white shadow-md"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {cartProducts.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-2xl border border-brand-100 p-2.5"
                >
                  <ProductArt
                    category={product.category}
                    seed={PRODUCTS.findIndex((p) => p.id === product.id)}
                    className="h-16 w-16 shrink-0 rounded-xl"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-bold text-ink">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted">{product.unit}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-brand-50 p-0.5 ring-1 ring-brand-200">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="grid h-6 w-6 place-items-center rounded-full text-brand-700 hover:bg-white"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-brand-700">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="grid h-6 w-6 place-items-center rounded-full text-brand-700 hover:bg-white"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-ink">
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

            <div className="border-t border-brand-100 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-lg font-extrabold text-ink">
                  {money(subtotal)}
                </span>
              </div>
              <Link
                to="/cart"
                onClick={closeCart}
                className="block w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 text-center font-bold text-white shadow-lg shadow-brand-200 transition hover:brightness-105"
              >
                View cart & checkout →
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
