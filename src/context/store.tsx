import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { COUPONS, PRODUCTS, type Product } from "../data";

/* ── Types ───────────────────────────────────────────────────────── */
export interface User {
  name: string;
  email: string;
  phone?: string;
}
export interface CartItem {
  id: string;
  qty: number;
}
export interface Order {
  id: string;
  date: string;
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  coupon: string | null;
  address: { name: string; phone: string; line: string; city: string; pin: string };
  slot: string;
  status: string;
}
export interface Toast {
  id: number;
  type: "success" | "info" | "error" | "cart";
  message: string;
}

interface Store {
  // auth
  user: User | null;
  login: (email: string, name?: string, phone?: string) => void;
  logout: () => void;
  // location
  city: string;
  setCity: (c: string) => void;
  // cart
  cart: CartItem[];
  cartCount: number;
  cartProducts: { product: Product; qty: number }[];
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  // pricing
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  freeDeliveryLeft: number;
  // coupon
  coupon: string | null;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  // orders
  orders: Order[];
  placeOrder: (
    address: Order["address"],
    slot: string
  ) => Order;
  // toasts
  toasts: Toast[];
  toast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: number) => void;
  // welcome popup
  seenWelcome: boolean;
  markWelcomeSeen: () => void;
}

const Ctx = createContext<Store | null>(null);

const FREE_DELIVERY_OVER = 599;
const DELIVERY_FEE = 39;

/* ── localStorage helpers ────────────────────────────────────────── */
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const byId = (id: string) => PRODUCTS.find((p) => p.id === id);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load("nfm_user", null));
  const [city, setCityState] = useState<string>(() => load("nfm_city", "Chennai"));
  const [cart, setCart] = useState<CartItem[]>(() => load("nfm_cart", []));
  const [coupon, setCoupon] = useState<string | null>(() => load("nfm_coupon", null));
  const [orders, setOrders] = useState<Order[]>(() => load("nfm_orders", []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [seenWelcome, setSeenWelcome] = useState<boolean>(() =>
    load("nfm_welcome", false)
  );

  useEffect(() => save("nfm_user", user), [user]);
  useEffect(() => save("nfm_city", city), [city]);
  useEffect(() => save("nfm_cart", cart), [cart]);
  useEffect(() => save("nfm_coupon", coupon), [coupon]);
  useEffect(() => save("nfm_orders", orders), [orders]);
  useEffect(() => save("nfm_welcome", seenWelcome), [seenWelcome]);

  /* ── toasts ── */
  function toast(message: string, type: Toast["type"] = "success") {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }
  const dismissToast = (id: number) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  /* ── cart ── */
  function add(id: string, qty = 1) {
    setCart((c) => {
      const found = c.find((i) => i.id === id);
      if (found)
        return c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...c, { id, qty }];
    });
    const p = byId(id);
    if (p) toast(`${p.name} added to cart`, "cart");
  }
  function setQty(id: string, qty: number) {
    if (qty <= 0) return remove(id);
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty } : i)));
  }
  function remove(id: string) {
    setCart((c) => c.filter((i) => i.id !== id));
  }
  const clearCart = () => setCart([]);

  const cartProducts = useMemo(
    () =>
      cart
        .map((i) => ({ product: byId(i.id)!, qty: i.qty }))
        .filter((x) => x.product),
    [cart]
  );
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cartProducts.reduce(
    (s, { product, qty }) => s + product.price * qty,
    0
  );

  /* ── coupon / pricing ── */
  const discount = useMemo(() => {
    if (!coupon) return 0;
    const c = COUPONS[coupon];
    if (!c || subtotal < c.min) return 0;
    if (c.type === "percent") return Math.round((subtotal * c.value) / 100);
    return Math.min(c.value, subtotal);
  }, [coupon, subtotal]);

  const delivery =
    subtotal === 0 || subtotal - discount >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = Math.max(0, subtotal - discount) + delivery;
  const freeDeliveryLeft = Math.max(0, FREE_DELIVERY_OVER - (subtotal - discount));

  function applyCoupon(code: string) {
    const key = code.trim().toUpperCase();
    const c = COUPONS[key];
    if (!c) return { ok: false, message: "That code doesn't look right." };
    if (subtotal < c.min)
      return {
        ok: false,
        message: `Add ₹${(c.min - subtotal).toLocaleString(
          "en-IN"
        )} more to use ${key}.`,
      };
    setCoupon(key);
    toast(`Coupon ${key} applied — ${c.label}!`, "success");
    return { ok: true, message: `Coupon ${key} applied!` };
  }
  const removeCoupon = () => setCoupon(null);

  /* ── auth ── */
  function login(email: string, name?: string, phone?: string) {
    const u: User = {
      email,
      name: name || email.split("@")[0].replace(/[.\-_]/g, " ") || "Guest",
      phone,
    };
    setUser(u);
    toast(`Welcome, ${u.name.split(" ")[0]}! 🐟`, "success");
  }
  function logout() {
    setUser(null);
    toast("You've been logged out.", "info");
  }

  /* ── orders ── */
  function placeOrder(address: Order["address"], slot: string): Order {
    const order: Order = {
      id: "NFM" + Math.floor(100000 + Math.random() * 899999),
      date: new Date().toISOString(),
      items: cartProducts.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        qty,
        price: product.price,
      })),
      subtotal,
      discount,
      delivery,
      total,
      coupon,
      address,
      slot,
      status: "Confirmed",
    };
    setOrders((o) => [order, ...o]);
    clearCart();
    setCoupon(null);
    return order;
  }

  const markWelcomeSeen = () => setSeenWelcome(true);

  const value: Store = {
    user,
    login,
    logout,
    city,
    setCity: setCityState,
    cart,
    cartCount,
    cartProducts,
    add,
    setQty,
    remove,
    clearCart,
    subtotal,
    discount,
    delivery,
    total,
    freeDeliveryLeft,
    coupon,
    applyCoupon,
    removeCoupon,
    orders,
    placeOrder,
    toasts,
    toast,
    dismissToast,
    seenWelcome,
    markWelcomeSeen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
