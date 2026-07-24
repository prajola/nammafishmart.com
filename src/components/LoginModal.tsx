import { useState } from "react";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";
import { LogoMark } from "./Logo";
import { signInWithGoogle, isFirebaseConfigured } from "../lib/firebase";

type Mode = "login" | "signup";

export default function LoginModal() {
  const { authenticate, register, login, toast } = useStore();
  const { loginOpen, closeLogin } = useUI();
  const [googleBusy, setGoogleBusy] = useState(false);

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!loginOpen) return null;

  const reset = () => {
    setErrors({});
    setPassword("");
    setConfirm("");
    setShow(false);
  };
  const close = () => {
    reset();
    setName("");
    setEmail("");
    closeLogin();
  };
  const switchMode = (m: Mode) => {
    setMode(m);
    reset();
  };

  const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "signup" && name.trim().length < 2)
      e.name = "Please enter your name.";
    if (!emailOk(email)) e.email = "Enter a valid email address.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (mode === "signup" && confirm !== password)
      e.confirm = "Passwords don't match.";
    setErrors(e);
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      toast(Object.values(e)[0], "error"); // pop up the first problem
      return;
    }

    if (mode === "signup") {
      const res = register(name, email, password);
      if (!res.ok) {
        setErrors({ email: res.error! });
        toast(res.error!, "error");
        return;
      }
      close();
    } else {
      const res = authenticate(email, password);
      if (!res.ok) {
        if (res.error === "no-account") {
          setErrors({ email: "No account found with this email." });
          toast("No account found — create one to continue.", "error");
        } else {
          setErrors({ password: "Incorrect password. Try again." });
          toast("Incorrect password. Please try again.", "error");
        }
        return;
      }
      close();
    }
  };

  const googleSignIn = async () => {
    setGoogleBusy(true);
    try {
      const profile = await signInWithGoogle();
      login(profile.email, profile.name);
      close();
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "not-configured") {
        toast("Google sign-in isn't set up yet — see FIREBASE_SETUP.md.", "info");
      } else if (/popup-closed|cancelled|popup_closed/i.test(code)) {
        // user closed the popup — no toast needed
      } else {
        toast("Google sign-in failed. Please try again.", "error");
      }
    } finally {
      setGoogleBusy(false);
    }
  };

  const strength = pwStrength(password);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-900/75 backdrop-blur-md" onClick={close} />
      <div className="pop-in relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-navy-800 shadow-2xl">
        {/* Header band */}
        <div className="sky-band relative px-6 pt-7 pb-6">
          <button
            onClick={close}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-ink transition hover:bg-white/20"
            aria-label="Close"
          >
            ✕
          </button>
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-md">
            <LogoMark className="h-full w-full" />
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted">
            {mode === "login"
              ? "Login to track orders & unlock fresh-catch offers."
              : "Join Namma Fish Mart — it takes 20 seconds."}
          </p>

          {/* Tab switch */}
          <div className="mt-4 flex rounded-xl border border-white/10 bg-white/5 p-1 text-sm font-bold">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-lg py-2 transition ${
                  mode === m
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow"
                    : "text-muted hover:text-ink"
                }`}
              >
                {m === "login" ? "Login" : "Sign up"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} noValidate className="space-y-3 p-6">
          {/* Google OAuth — only when Firebase is configured */}
          {isFirebaseConfigured && (
            <>
              <button
                type="button"
                onClick={googleSignIn}
                disabled={googleBusy}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-bold text-navy-900 transition hover:bg-white/90 disabled:opacity-60"
              >
                <GoogleIcon />
                {googleBusy ? "Connecting…" : "Continue with Google"}
              </button>
              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  or
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            </>
          )}

          {mode === "signup" && (
            <Field
              label="Full name"
              value={name}
              onChange={(v) => {
                setName(v);
                setErrors((e) => ({ ...e, name: "" }));
              }}
              placeholder="Meera Nair"
              error={errors.name}
              icon={<UserIcon />}
            />
          )}

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              setErrors((e) => ({ ...e, email: "" }));
            }}
            placeholder="you@example.com"
            error={errors.email}
            icon={<MailIcon />}
          />

          {/* Password with reveal */}
          <div>
            <label className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Password</span>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() =>
                    toast("Password reset link sent to your email (demo).", "info")
                  }
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </label>
            <div
              className={`flex items-center rounded-xl border bg-white/5 px-3 transition focus-within:bg-navy-800 focus-within:ring-2 ${
                errors.password
                  ? "border-red-400 focus-within:ring-red-100"
                  : "border-white/15 focus-within:border-brand-500 focus-within:ring-brand-200"
              }`}
            >
              <span className="flex text-muted">
                <LockIcon />
              </span>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((er) => ({ ...er, password: "" }));
                }}
                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                className="w-full bg-transparent px-2 py-2.5 text-sm text-ink outline-none"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="rounded-md px-1 text-lg text-muted hover:text-brand-600"
                aria-label={show ? "Hide password" : "Show password"}
                title={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>
            )}
            {/* Strength meter (signup) */}
            {mode === "signup" && password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < strength.score ? strength.color : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] font-semibold text-muted">
                  Password strength: <span className={strength.text}>{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          {mode === "signup" && (
            <Field
              label="Confirm password"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(v) => {
                setConfirm(v);
                setErrors((e) => ({ ...e, confirm: "" }));
              }}
              placeholder="Re-enter password"
              error={errors.confirm}
              icon={<LockIcon />}
            />
          )}

          <button className="!mt-4 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg transition hover:brightness-105 active:scale-[0.99]">
            {mode === "login" ? "Login →" : "Create account →"}
          </button>

          <p className="pt-1 text-center text-sm text-muted">
            {mode === "login" ? "New to Namma Fish Mart?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="font-bold text-brand-600 hover:underline"
            >
              {mode === "login" ? "Create an account" : "Login instead"}
            </button>
          </p>

          <p className="text-center text-[11px] text-muted">
            🔒 Demo login — your details stay in this browser only.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ── Clean line icons (Feather/Lucide style) ─────────────────────── */
const ICLS = "h-[18px] w-[18px] shrink-0";
const svgProps = {
  viewBox: "0 0 24 24",
  className: ICLS,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
export const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);
export const UserIcon = () => (
  <svg {...svgProps}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
export const MailIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const LockIcon = () => (
  <svg {...svgProps}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);
export const EyeIcon = () => (
  <svg {...svgProps}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const EyeOffIcon = () => (
  <svg {...svgProps}>
    <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 8 10 8a15.8 15.8 0 0 1-2 2.88M6.6 6.6A15.9 15.9 0 0 0 2 12s3.5 8 10 8a9 9 0 0 0 3.4-.66" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m2 2 20 20" />
  </svg>
);

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted">{label}</label>
      <div
        className={`flex items-center rounded-xl border bg-white/5 px-3 transition focus-within:bg-navy-800 focus-within:ring-2 ${
          error
            ? "border-red-400 focus-within:ring-red-100"
            : "border-white/15 focus-within:border-brand-500 focus-within:ring-brand-200"
        }`}
      >
        {icon && <span className="flex text-muted">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-2 py-2.5 text-sm text-ink outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

function pwStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10 || /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) && /[A-Z]/.test(pw)) score++;
  score = Math.min(score, 3);
  const map = [
    { label: "Too short", color: "bg-red-400", text: "text-red-500" },
    { label: "Weak", color: "bg-amber-400", text: "text-amber-500" },
    { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
    { label: "Strong", color: "bg-green-500", text: "text-green-600" },
  ];
  return { score, ...map[score] };
}
