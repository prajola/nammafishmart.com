import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import LoginModal from "./components/LoginModal";
import WelcomePopup from "./components/WelcomePopup";
import Toasts from "./components/Toasts";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Sourcing from "./pages/Sourcing";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 py-1.5 text-center text-xs font-semibold text-white">
        🚚 Free delivery over ₹599 · Same-day delivery · Freshness guaranteed
      </div>

      <ScrollTop />
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <LoginModal />
      <WelcomePopup />
      <Toasts />
    </div>
  );
}
