# 🐟 Namma Fish Mart

A modern, fully-working **fresh fish & seafood** storefront — white + sky-blue theme, built with **React + Vite + TypeScript + Tailwind CSS v4**.

> An original demo storefront (branding, copy, catalogue and artwork are all original). No backend required — auth, cart, coupons and orders persist in the browser via `localStorage`, so every flow works end-to-end.

## ✨ Features

- **Browse & explore** — home, category grid, and a shop page with live search, category filters and sorting.
- **Product pages** — details, ratings, weights, related items, quantity stepper.
- **Cart** — slide-in drawer + full cart page, quantity controls, free-delivery progress.
- **Coupons & discounts** — `NEW50` (₹50 off), `FRESH10` (10%), `OCEAN20` (20% over ₹999), live bill breakdown.
- **Login / signup** — email + OTP demo flow (any 4-digit code), persisted session.
- **Checkout → order** — address, delivery slot, payment method, order confirmation.
- **Orders** — history with a live delivery-tracking progress bar.
- **Popups & toasts** — welcome discount popup + toast notifications everywhere.
- **Header** — logo, location selector, search, account menu, live cart count.
- **Footer** — newsletter, shop links, contact, socials.
- Responsive, animated, and accessible.

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

## 🧪 Try it out

1. A **welcome offer popup** appears — grab `NEW50`.
2. **Add** a few items → open the **cart** → apply a coupon.
3. **Login** with any email + any 4-digit OTP.
4. **Checkout** → fill address → **Place order**.
5. See it in **My Orders** with live tracking.

## 🎨 Theme

White canvas with sky-blue (`#0ea5e9` → `#0284c7`) splashes, defined as `--color-brand-*` tokens in `src/index.css`.
Product artwork is self-contained SVG (`src/components/ProductArt.tsx`) — swap in real photos any time.

## 📁 Structure

```
src/
  components/   Header, Footer, CartDrawer, LoginModal, WelcomePopup, ProductCard, ProductArt, Toasts
  context/      store.tsx (auth, cart, coupons, orders, toasts) · ui.tsx (modals)
  pages/        Home, Shop, ProductDetail, Cart, Checkout, Orders
  data.ts       catalogue, categories, coupons, cities
```
