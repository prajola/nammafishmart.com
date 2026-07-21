import { Link } from "react-router-dom";
import { discountPct, money, type Product } from "../data";
import { useStore } from "../context/store";
import ProductImage from "./ProductImage";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-amber-500">
      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
      </svg>
      <span className="text-xs font-semibold text-ink">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { add, cart, setQty } = useStore();
  const inCart = cart.find((i) => i.id === product.id);
  const off = discountPct(product);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      {off > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
          {off}% OFF
        </span>
      )}
      {product.tags?.[0] && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700 shadow-sm ring-1 ring-brand-100">
          {product.tags[0]}
        </span>
      )}

      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <ProductImage
          product={product}
          className="h-40 w-full transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-muted">{product.reviews} reviews</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-[15px] font-semibold leading-tight text-ink hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        {product.local && (
          <p className="text-xs italic text-muted">{product.local}</p>
        )}
        <p className="mt-1 text-xs text-muted">
          {product.unit}
          {product.pieces ? ` · ${product.pieces}` : ""}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            {product.startFrom && (
              <span className="block text-[11px] font-semibold text-muted">
                Start from
              </span>
            )}
            <span className="text-lg font-extrabold text-ink">
              {money(product.price)}
            </span>
            {!product.startFrom && product.mrp > product.price && (
              <span className="ml-1.5 text-xs text-muted line-through">
                {money(product.mrp)}
              </span>
            )}
          </div>

          {product.soldOut ? (
            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-bold text-muted">
              🛒 Out Of Stock
            </span>
          ) : inCart ? (
            <div className="flex items-center gap-1 rounded-full bg-white/5 p-0.5 ring-1 ring-brand-200">
              <button
                aria-label="decrease"
                onClick={() => setQty(product.id, inCart.qty - 1)}
                className="grid h-7 w-7 place-items-center rounded-full text-brand-700 hover:bg-navy-800"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-bold text-brand-700">
                {inCart.qty}
              </span>
              <button
                aria-label="increase"
                onClick={() => setQty(product.id, inCart.qty + 1)}
                className="grid h-7 w-7 place-items-center rounded-full text-brand-700 hover:bg-navy-800"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => add(product.id)}
              className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
