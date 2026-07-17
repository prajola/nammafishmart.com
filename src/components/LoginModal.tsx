import { useState } from "react";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";

export default function LoginModal() {
  const { login } = useStore();
  const { loginOpen, closeLogin } = useUI();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");

  if (!loginOpen) return null;

  const reset = () => {
    setStep("form");
    setOtp("");
  };
  const close = () => {
    reset();
    closeLogin();
  };

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setStep("otp");
  };
  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo auth: any 4-digit OTP works.
    if (otp.trim().length < 4) return;
    login(email, mode === "signup" ? name : undefined, phone);
    close();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm" onClick={close} />
      <div className="pop-in relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* header band */}
        <div className="sky-band relative px-6 pt-6 pb-5">
          <button
            onClick={close}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink hover:bg-white"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="mb-1 text-2xl">🐟</div>
          <h2 className="text-xl font-extrabold text-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted">
            {step === "form"
              ? "Login to track orders & get fresh-catch offers."
              : `We sent a code to ${email}`}
          </p>
        </div>

        <div className="p-6">
          {step === "form" ? (
            <form onSubmit={sendOtp} className="space-y-3">
              {mode === "signup" && (
                <Field
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="Meera Nair"
                  required
                />
              )}
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                required
              />
              <Field
                label="Phone (optional)"
                value={phone}
                onChange={setPhone}
                placeholder="+91 90000 00000"
              />
              <button className="mt-1 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg shadow-brand-200 transition hover:brightness-105 active:scale-[0.99]">
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={verify} className="space-y-3">
              <Field
                label="Enter OTP"
                value={otp}
                onChange={setOtp}
                placeholder="Any 4 digits (demo)"
                required
              />
              <button className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg shadow-brand-200 transition hover:brightness-105 active:scale-[0.99]">
                Verify & Login
              </button>
              <button
                type="button"
                onClick={reset}
                className="w-full text-sm font-medium text-brand-600 hover:underline"
              >
                ← Change details
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-muted">
            {mode === "login" ? "New to Namma Fish Mart?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                reset();
              }}
              className="font-bold text-brand-600 hover:underline"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-brand-200 bg-brand-50/40 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}
