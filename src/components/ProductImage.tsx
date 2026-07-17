import { useState } from "react";
import { PRODUCTS, type Product } from "../data";
import ProductArt from "./ProductArt";

/**
 * Real product photo with a graceful fallback: if the image is missing or
 * fails to load, we render the on-theme SVG illustration instead — so the
 * catalogue never shows a broken image.
 */
export default function ProductImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const seed = PRODUCTS.findIndex((p) => p.id === product.id);

  if (failed) {
    return <ProductArt category={product.category} seed={seed} className={className} />;
  }

  return (
    <img
      src={`/images/${product.id}.jpg`}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-brand-50 object-cover ${className}`}
    />
  );
}
