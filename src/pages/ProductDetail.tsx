import { Link, useParams } from "react-router-dom";
import { discountPct, money, PRODUCTS } from "../data";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const { add, cart, setQty } = useStore();
  const { openCart } = useUI();

  if (!product) {
    return (
      <div className="grid place-items-center gap-3 py-24 text-center">
        <div className="text-6xl">🐠</div>
        <p className="text-lg font-bold">Product not found</p>
        <Link to="/shop" className="font-bold text-brand-600 hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const inCart = cart.find((i) => i.id === product.id);
  const off = discountPct(product);
  const seed = PRODUCTS.findIndex((p) => p.id === product.id);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 text-sm text-muted">
        <Link to="/" className="hover:text-brand-600">
          Home
        </Link>{" "}
        /{" "}
        <Link to={`/shop?cat=${product.category}`} className="hover:text-brand-600">
          {product.category}
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Art */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-100 shadow-[var(--shadow-card)]">
          {off > 0 && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1.5 text-sm font-bold text-white shadow">
              {off}% OFF
            </span>
          )}
          <ProductImage product={product} className="h-72 w-full md:h-full" />
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-ink">{product.name}</h1>
          {product.local && (
            <p className="text-muted">
              Also known as <span className="italic">{product.local}</span>
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded-md bg-green-50 px-2 py-0.5 font-bold text-green-600">
              ★ {product.rating.toFixed(1)}
            </span>
            <span className="text-muted">{product.reviews} reviews</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-ink">
              {money(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="pb-1 text-lg text-muted line-through">
                  {money(product.mrp)}
                </span>
                <span className="pb-1.5 font-bold text-green-600">
                  Save {money(product.mrp - product.price)}
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-muted">Inclusive of all taxes</p>

          <p className="mt-4 text-ink">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            {[
              ["Net weight", product.unit],
              ["Pieces", product.pieces ?? "—"],
              ["Serves", product.serves ?? "—"],
              ["Category", product.category],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-brand-100 bg-brand-50/40 p-3">
                <dt className="text-xs font-semibold uppercase text-muted">{k}</dt>
                <dd className="font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          {/* CTA */}
          <div className="mt-6 flex items-center gap-3">
            {inCart ? (
              <div className="flex items-center gap-2 rounded-xl bg-brand-50 p-1 ring-1 ring-brand-200">
                <button
                  onClick={() => setQty(product.id, inCart.qty - 1)}
                  className="grid h-11 w-11 place-items-center rounded-lg text-xl font-bold text-brand-700 hover:bg-white"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg font-extrabold text-brand-700">
                  {inCart.qty}
                </span>
                <button
                  onClick={() => setQty(product.id, inCart.qty + 1)}
                  className="grid h-11 w-11 place-items-center rounded-lg text-xl font-bold text-brand-700 hover:bg-white"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => add(product.id)}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-lg font-bold text-white shadow-lg shadow-brand-200 transition hover:scale-[1.02]"
              >
                Add to cart · {money(product.price)}
              </button>
            )}
            <button
              onClick={openCart}
              className="rounded-xl border border-brand-200 bg-white px-6 py-3.5 font-bold text-brand-700 hover:bg-brand-50"
            >
              Go to cart 🛒
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted">
            <span>🧊 Never frozen</span>
            <span>🔪 Cleaned & cut free</span>
            <span>🚚 Delivered in hours</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-extrabold text-ink">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
