import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";
import EditableText from "@/components/EditableText";

const C = {
  forest: "#12241c",
  moss: "#2d5a3d",
  clay: "#c4654a",
  gold: "#e8c07a",
  cream: "#f5efe3",
};

const TIERS = [
  "Mentor Partner, $1,000",
  "Megaphone Partner, $5,000",
  "Not sure yet",
];

const schema = z.object({
  full_name: z.string().trim().min(1, "Your name is required").max(100),
  company: z.string().trim().min(1, "Company is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  tier: z.string().trim().min(1, "Pick an option").max(60),
  message: z.string().trim().max(1000).optional(),
});

const fieldClass =
  "w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-0";
const fieldStyle: React.CSSProperties = {
  background: "#ffffff",
  borderColor: "rgba(18,36,28,0.18)",
  color: C.forest,
};
const labelClass = "block text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5";

const SponsorTierForm = () => {
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    tier: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error: dbError } = await (supabase as any)
      .from("hbcu_mentor_sponsor_inquiries")
      .insert(parsed.data);
    setBusy(false);
    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl px-6 py-12 text-center" style={{ background: C.cream }}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: C.moss }}>
          <Check className="h-6 w-6" style={{ color: C.gold }} />
        </div>
        <p className="text-lg font-semibold" style={{ color: C.forest }}>
          <EditableText settingKey="form_confirmation" defaultText="Got it. We'll be in touch." as="span" />
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl p-6 sm:p-8"
      style={{ background: C.cream, color: C.forest }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="sm-name">Name</label>
          <input
            id="sm-name"
            className={fieldClass}
            style={fieldStyle}
            value={form.full_name}
            maxLength={100}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="sm-company">Company</label>
          <input
            id="sm-company"
            className={fieldClass}
            style={fieldStyle}
            value={form.company}
            maxLength={120}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="sm-email">Email</label>
        <input
          id="sm-email"
          type="email"
          className={fieldClass}
          style={fieldStyle}
          value={form.email}
          maxLength={255}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <span className={labelClass}>Which tier</span>
        <div className="grid gap-2 sm:grid-cols-3">
          {TIERS.map((t) => {
            const active = form.tier === t;
            return (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, tier: t })}
                className="rounded-md border px-3 py-2 text-sm font-semibold transition-colors"
                style={{
                  background: active ? C.forest : "#fff",
                  color: active ? C.cream : C.forest,
                  borderColor: active ? C.forest : "rgba(18,36,28,0.18)",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="sm-message">Message (optional)</label>
        <textarea
          id="sm-message"
          rows={4}
          className={fieldClass}
          style={fieldStyle}
          value={form.message}
          maxLength={1000}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {error && (
        <p className="text-sm font-semibold" style={{ color: C.clay }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-transform hover:scale-[1.01] disabled:opacity-60"
        style={{ background: C.clay, color: "#fff" }}
      >
        {busy ? "Sending" : "Send it"}
      </button>
    </form>
  );
};

export default SponsorTierForm;
