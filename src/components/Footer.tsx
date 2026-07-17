import { Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../context/store";
import { LogoMark } from "./Logo";

export default function Footer() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    toast("Subscribed! Watch out for weekly fresh-catch deals 🎣", "success");
    setEmail("");
  };

  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-900 text-brand-100">
      {/* Newsletter */}
      <div className="sky-band">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="text-2xl font-extrabold text-ink">
              Never miss a fresh catch 🌊
            </h3>
            <p className="text-sm text-muted">
              Subscribe for weekly deals, new arrivals & recipes.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 font-bold text-white shadow-md">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <LogoMark className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              Namma<span className="text-brand-300">Fish</span>Mart
            </span>
          </div>
          <p className="text-sm text-brand-200">
            Fresh fish & seafood, cleaned and cut the way you like — delivered to
            your door across South India.
          </p>
          <div className="mt-4 flex gap-2">
            {["📘", "📸", "🐦", "▶️"].map((s, i) => (
              <span
                key={i}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            ["Fish", "/shop?cat=Fish"],
            ["Prawns & Shrimp", "/shop?cat=Prawns"],
            ["Crab", "/shop?cat=Crab"],
            ["Combos", "/shop?cat=Combo"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["About us", "/about"],
            ["Our sourcing", "/sourcing"],
            ["Careers", "/careers"],
            ["Contact", "/contact"],
          ]}
        />
        <div>
          <h4 className="mb-3 font-bold text-white">Get in touch</h4>
          <ul className="space-y-2 text-sm text-brand-200">
            <li>📞 1800-FRESH-FISH</li>
            <li>✉️ care@nammafishmart.com</li>
            <li>🕑 Daily 6 AM – 10 PM</li>
            <li className="flex gap-1 pt-2 text-xl">💳 🏦 📱 💰</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-brand-300">
        © {new Date().getFullYear()} Namma Fish Mart. Freshness guaranteed or your
        money back. · A demo storefront.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h4 className="mb-3 font-bold text-white">{title}</h4>
      <ul className="space-y-2 text-sm text-brand-200">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
