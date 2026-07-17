import { useState } from "react";
import { useStore } from "../context/store";

export default function Contact() {
  const { toast } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General enquiry");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
      toast("Please fill in your name, a valid email and a message.", "error");
      return;
    }
    toast("Thanks! We'll get back to you within a few hours. 🐟", "success");
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div>
      <section className="sky-band">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-brand-100">
            💬 Contact us
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-ink md:text-5xl">
            We'd love to{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              hear from you.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Questions, feedback, or a special order? Our team is here daily from
            6 AM to 10 PM.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-[1fr_1.2fr]">
        {/* Contact details */}
        <div className="space-y-4">
          {[
            ["📞", "Call us", "1800-FRESH-FISH", "Daily 6 AM – 10 PM"],
            ["✉️", "Email", "care@nammafishmart.com", "We reply within a few hours"],
            ["💬", "WhatsApp", "+91 90000 00000", "Chat for quick help"],
            ["📍", "Head office", "Marina Bay, Chennai", "Tamil Nadu, India"],
          ].map(([i, t, a, s]) => (
            <div
              key={t}
              className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">
                {i}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
                  {t}
                </p>
                <p className="font-bold text-ink">{a}</p>
                <p className="text-sm text-muted">{s}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-[var(--shadow-card)]">
          {sent && (
            <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              ✅ Message sent! We'll be in touch soon.
            </div>
          )}
          <form onSubmit={submit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Your name" value={name} onChange={setName} placeholder="Meera Nair" />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Subject</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-brand-200 bg-brand-50/40 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
              >
                {["General enquiry", "Order support", "Bulk / catering", "Feedback", "Partnership"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-muted">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="How can we help?"
                className="w-full resize-none rounded-xl border border-brand-200 bg-brand-50/40 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
              />
            </label>
            <button className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-bold text-white shadow-lg shadow-brand-200 transition hover:brightness-105">
              Send message →
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-200 bg-brand-50/40 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}
