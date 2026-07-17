import { useState } from "react";
import { useStore } from "../context/store";
import { useUI } from "../context/ui";

type Mode = "login" | "signup";

export default function LoginModal() {
  const { authenticate, register, toast } = useStore();
  const { loginOpen, closeLogin } = useUI();

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

  const strength = pwStrength(password);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm" onClick={close} />
      <div className="pop-in relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header band */}
        <div className="sky-band relative px-6 pt-7 pb-6">
          <button
            onClick={close}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink hover:bg-white"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-2xl shadow-md">
            🐟
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted">
            {mode === "login"
              ? "Login to track orders & unlock fresh-catch offers."
              : "Join Namma Fish Mart — it takes 20 seconds."}
          </p>

          {/* Tab switch */}
          <div className="mt-4 flex rounded-xl bg-white/70 p-1 text-sm font-bold">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-lg py-2 transition ${
                  mode === m
                    ? "bg-white text-brand-700 shadow"
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
              icon="👤"
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
            icon="✉️"
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
              className={`flex items-center rounded-xl border bg-brand-50/40 px-3 transition focus-within:bg-white focus-within:ring-2 ${
                errors.password
                  ? "border-red-400 focus-within:ring-red-100"
                  : "border-brand-200 focus-within:border-brand-500 focus-within:ring-brand-200"
              }`}
            >
              <span className="text-muted">🔒</span>
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
                {show ? "🙈" : "👁️"}
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
                        i < strength.score ? strength.color : "bg-brand-100"
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
              icon="🔒"
            />
          )}

          <button className="!mt-4 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg shadow-brand-200 transition hover:brightness-105 active:scale-[0.99]">
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
  icon?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted">{label}</label>
      <div
        className={`flex items-center rounded-xl border bg-brand-50/40 px-3 transition focus-within:bg-white focus-within:ring-2 ${
          error
            ? "border-red-400 focus-within:ring-red-100"
            : "border-brand-200 focus-within:border-brand-500 focus-within:ring-brand-200"
        }`}
      >
        {icon && <span className="text-muted">{icon}</span>}
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
