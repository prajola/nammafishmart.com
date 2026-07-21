/**
 * Live catalog layer.
 *
 * The public site reads categories + products from here instead of importing
 * the static arrays directly. It is SEEDED from the static data in `data.ts`,
 * so with no backend configured and no admin edits, the site renders exactly
 * as before ("should not affect anything").
 *
 * Two interchangeable backends sit behind one API:
 *   • 'supabase' — when VITE_SUPABASE_URL/ANON_KEY are set. Edits persist to
 *     Postgres + Storage and reflect in PRODUCTION for every visitor.
 *   • 'local'    — otherwise. Edits persist to this browser's localStorage so
 *     the admin portal is fully functional for preview/demo (not shared).
 */
import {
  CATEGORIES as SEED_CATEGORIES,
  PRODUCTS as SEED_PRODUCTS,
  type Product,
} from "../data";
import { IMAGE_BUCKET, isSupabaseConfigured, getSupabase } from "./supabase";

export type CatalogCategory = {
  key: string;
  label: string;
  emoji: string;
  img: string;
};
export type CatalogProduct = Product;

export const backend: "supabase" | "local" = isSupabaseConfigured
  ? "supabase"
  : "local";

type State = {
  categories: CatalogCategory[];
  products: CatalogProduct[];
  loaded: boolean;
  source: "static" | "local" | "supabase";
};

const LS_CATS = "nfm_catalog_categories";
const LS_PRODS = "nfm_catalog_products";

let state: State = {
  categories: SEED_CATEGORIES as CatalogCategory[],
  products: SEED_PRODUCTS as CatalogProduct[],
  loaded: false,
  source: "static",
};

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
export function subscribeCatalog(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function getCatalog(): State {
  return state;
}
/** Synchronous product lookup used by the cart store. */
export function productById(id: string): CatalogProduct | undefined {
  return state.products.find((p) => p.id === id);
}

// ─── localStorage helpers ────────────────────────────────────────────────
function readLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function writeLS(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore quota errors */
  }
}
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ─── Supabase row <-> app model mapping ──────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function prodFromRow(r: any): CatalogProduct {
  return {
    id: r.id,
    name: r.name,
    local: r.local ?? undefined,
    category: r.category,
    price: Number(r.price),
    mrp: Number(r.mrp),
    unit: r.unit ?? "",
    pieces: r.pieces ?? undefined,
    serves: r.serves ?? undefined,
    tags: r.tags ?? undefined,
    description: r.description ?? "",
    rating: Number(r.rating ?? 0),
    reviews: Number(r.reviews ?? 0),
    img: r.img ?? undefined,
    soldOut: r.sold_out ?? undefined,
    startFrom: r.start_from ?? undefined,
  };
}
function prodToRow(p: CatalogProduct) {
  return {
    id: p.id,
    name: p.name,
    local: p.local ?? null,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    unit: p.unit,
    pieces: p.pieces ?? null,
    serves: p.serves ?? null,
    tags: p.tags ?? null,
    description: p.description,
    rating: p.rating,
    reviews: p.reviews,
    img: p.img ?? null,
    sold_out: p.soldOut ?? false,
    start_from: p.startFrom ?? false,
  };
}
function catFromRow(r: any): CatalogCategory {
  return { key: r.key, label: r.label, emoji: r.emoji ?? "🐟", img: r.img ?? "" };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Load ────────────────────────────────────────────────────────────────
let loadingPromise: Promise<void> | null = null;
export function loadCatalog(): Promise<void> {
  // De-dupe concurrent loads triggered by multiple components mounting.
  if (loadingPromise) return loadingPromise;
  loadingPromise = doLoad().finally(() => {
    loadingPromise = null;
  });
  return loadingPromise;
}

async function doLoad(): Promise<void> {
  if (backend === "supabase") {
    try {
      const sb = await getSupabase();
      const [{ data: cats, error: e1 }, { data: prods, error: e2 }] =
        await Promise.all([
          sb.from("categories").select("*").order("sort", { ascending: true }),
          sb
            .from("products")
            .select("*")
            .order("created_at", { ascending: true }),
        ]);
      if (e1 || e2) throw e1 || e2;
      state = {
        categories: (cats ?? []).map(catFromRow),
        products: (prods ?? []).map(prodFromRow),
        loaded: true,
        source: "supabase",
      };
      emit();
      return;
    } catch (err) {
      // Never break the site — fall back to seed data if the backend is down.
      console.error("[catalog] Supabase load failed, using seed data:", err);
      state = { ...state, loaded: true };
      emit();
      return;
    }
  }

  // local backend
  const cats = readLS<CatalogCategory[]>(LS_CATS);
  const prods = readLS<CatalogProduct[]>(LS_PRODS);
  state = {
    categories: cats ?? (SEED_CATEGORIES as CatalogCategory[]),
    products: prods ?? (SEED_PRODUCTS as CatalogProduct[]),
    loaded: true,
    source: cats || prods ? "local" : "static",
  };
  emit();
}

function persistLocal() {
  writeLS(LS_CATS, state.categories);
  writeLS(LS_PRODS, state.products);
}

// ─── Image upload ─────────────────────────────────────────────────────────
/** Returns a URL (public Supabase URL, or a data URL in local mode). */
export async function uploadImage(file: File): Promise<string> {
  if (backend === "supabase") {
    const sb = await getSupabase();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await sb.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data } = sb.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
  return fileToDataUrl(file);
}

// ─── Product CRUD ─────────────────────────────────────────────────────────
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function saveProduct(p: CatalogProduct): Promise<void> {
  if (backend === "supabase") {
    const sb = await getSupabase();
    const { error } = await sb.from("products").upsert(prodToRow(p));
    if (error) throw error;
    await loadCatalog();
    return;
  }
  const i = state.products.findIndex((x) => x.id === p.id);
  const products =
    i >= 0
      ? state.products.map((x) => (x.id === p.id ? p : x))
      : [...state.products, p];
  state = { ...state, products, source: "local" };
  persistLocal();
  emit();
}

export async function deleteProduct(id: string): Promise<void> {
  if (backend === "supabase") {
    const sb = await getSupabase();
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) throw error;
    await loadCatalog();
    return;
  }
  state = {
    ...state,
    products: state.products.filter((p) => p.id !== id),
    source: "local",
  };
  persistLocal();
  emit();
}

// ─── Category CRUD ────────────────────────────────────────────────────────
export async function saveCategory(
  c: CatalogCategory,
  originalKey?: string
): Promise<void> {
  if (backend === "supabase") {
    const sb = await getSupabase();
    const sort = state.categories.length;
    const { error } = await sb
      .from("categories")
      .upsert({ key: c.key, label: c.label, emoji: c.emoji, img: c.img, sort });
    if (error) throw error;
    // if the key changed, remove the old row and re-point products
    if (originalKey && originalKey !== c.key) {
      await sb.from("products").update({ category: c.key }).eq("category", originalKey);
      await sb.from("categories").delete().eq("key", originalKey);
    }
    await loadCatalog();
    return;
  }
  const key = originalKey ?? c.key;
  const i = state.categories.findIndex((x) => x.key === key);
  const categories =
    i >= 0
      ? state.categories.map((x) => (x.key === key ? c : x))
      : [...state.categories, c];
  const products =
    originalKey && originalKey !== c.key
      ? state.products.map((p) =>
          p.category === originalKey ? { ...p, category: c.key } : p
        )
      : state.products;
  state = { ...state, categories, products, source: "local" };
  persistLocal();
  emit();
}

export async function deleteCategory(key: string): Promise<void> {
  if (backend === "supabase") {
    const sb = await getSupabase();
    const { error } = await sb.from("categories").delete().eq("key", key);
    if (error) throw error;
    await loadCatalog();
    return;
  }
  state = {
    ...state,
    categories: state.categories.filter((c) => c.key !== key),
    source: "local",
  };
  persistLocal();
  emit();
}

/**
 * Push the shipped demo catalog into Supabase (production mode). Use this once
 * after configuring Supabase so the store starts populated. Safe to re-run —
 * it upserts by primary key.
 */
export async function seedSupabaseFromDemo(): Promise<void> {
  if (backend !== "supabase") return;
  const sb = await getSupabase();
  const cats = (SEED_CATEGORIES as CatalogCategory[]).map((c, i) => ({
    key: c.key,
    label: c.label,
    emoji: c.emoji,
    img: c.img,
    sort: i,
  }));
  const { error: ce } = await sb.from("categories").upsert(cats);
  if (ce) throw ce;
  const { error: pe } = await sb
    .from("products")
    .upsert((SEED_PRODUCTS as CatalogProduct[]).map(prodToRow));
  if (pe) throw pe;
  await loadCatalog();
}

/** Reset local overrides back to the shipped seed data (local mode only). */
export function resetLocalCatalog() {
  try {
    localStorage.removeItem(LS_CATS);
    localStorage.removeItem(LS_PRODS);
  } catch {
    /* ignore */
  }
  state = {
    categories: SEED_CATEGORIES as CatalogCategory[],
    products: SEED_PRODUCTS as CatalogProduct[],
    loaded: true,
    source: "static",
  };
  emit();
}
