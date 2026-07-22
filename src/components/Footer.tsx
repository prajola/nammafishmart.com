import { Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../context/store";
import { LogoMark } from "./Logo";

const ICON = "h-[18px] w-[18px]";

/* Payment method badges — small white chips shown in "we accept" row. */
const CHIP = "h-6 w-9 rounded-[5px]";
const PAYMENTS = [
  {
    name: "UPI",
    icon: (
      <svg viewBox="0 0 40 26" className={CHIP} aria-hidden="true">
        <rect width="40" height="26" rx="5" fill="#fff" />
        <path d="M12 6l-4 14h3l4-14z" fill="#f9682f" />
        <path d="M17 6l-4 14h3l4-14z" fill="#5a9c3e" />
        <text x="27" y="17" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="8" fontWeight="800" fill="#191740">UPI</text>
      </svg>
    ),
  },
  {
    name: "Mastercard",
    icon: (
      <svg viewBox="0 0 40 26" className={CHIP} aria-hidden="true">
        <rect width="40" height="26" rx="5" fill="#fff" />
        <circle cx="17" cy="13" r="6.6" fill="#eb001b" />
        <circle cx="23" cy="13" r="6.6" fill="#f79e1b" />
        <path d="M20 8a6.6 6.6 0 0 0 0 10 6.6 6.6 0 0 0 0-10z" fill="#ff5f00" />
      </svg>
    ),
  },
  {
    name: "Visa",
    icon: (
      <svg viewBox="0 0 40 26" className={CHIP} aria-hidden="true">
        <rect width="40" height="26" rx="5" fill="#fff" />
        <text x="20" y="17.5" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="11" fontWeight="800" fontStyle="italic" fill="#1a1f71">VISA</text>
      </svg>
    ),
  },
  {
    name: "RuPay",
    icon: (
      <svg viewBox="0 0 40 26" className={CHIP} aria-hidden="true">
        <rect width="40" height="26" rx="5" fill="#fff" />
        <text x="20" y="16.5" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="8.5" fontWeight="800">
          <tspan fill="#191740">Ru</tspan><tspan fill="#f9682f">Pay</tspan>
        </text>
      </svg>
    ),
  },
  {
    name: "Cash on Delivery",
    icon: (
      <svg viewBox="0 0 40 26" className={CHIP} aria-hidden="true">
        <rect width="40" height="26" rx="5" fill="#fff" />
        <text x="20" y="17" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="9" fontWeight="800" fill="#191740">₹ COD</text>
      </svg>
    ),
  },
];
const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
        <path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.5h7.6l5.24 6.93zm-1.29 18.79h2.04L6.48 3.6H4.29z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.52 3.55 12 3.55 12 3.55s-7.52 0-9.39.52A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.87.52 9.39.52 9.39.52s7.52 0 9.39-.52a3 3 0 0 0 2.11-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"
        />
      </svg>
    ),
  },
];

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
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-b from-navy-800 to-navy-900 text-muted">
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
              className="flex-1 rounded-xl border border-white/15 bg-navy-800 px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 font-bold text-white shadow-md">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <LogoMark className="h-11 w-11" />
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-extrabold tracking-tight text-white">
                Namma<span className="text-brand-500">Fish</span>Mart
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                Fresh from the coast
              </span>
            </span>
          </div>
          <p className="text-sm text-muted">
            Fresh fish & seafood, cleaned and cut the way you like — delivered to
            your door across South India.
          </p>
          <div className="mt-4 flex gap-2">
            {SOCIALS.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                title={name}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:text-white"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            ["Fish", "/shop?cat=Fish"],
            ["Sea Fish", "/shop?cat=SeaFish"],
            ["River Fish", "/shop?cat=RiverFish"],
            ["Prawns", "/shop?cat=Prawns"],
            ["Crabs", "/shop?cat=Crabs"],
            ["Dry Fish", "/shop?cat=DryFish"],
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
            <li>✉️ nammafishmart@gmail.com</li>
            <li>🕑 Daily 6 AM – 10 PM</li>
          </ul>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
            We accept
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {PAYMENTS.map(({ name, icon }) => (
              <span key={name} title={name} aria-label={name} className="shadow-sm">
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-brand-300">
        © {new Date().getFullYear()} Namma Fish Mart. Freshness guaranteed or your
        money back. · A demo storefront. ·{" "}
        <Link to="/admin" className="hover:text-white">
          Admin
        </Link>
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
