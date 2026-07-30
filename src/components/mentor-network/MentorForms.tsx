import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

const C = {
  forest: "#12241c",
  moss: "#2d5a3d",
  clay: "#c4654a",
  gold: "#e8c07a",
  cream: "#f5efe3",
};

const field =
  "w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-0";
const fieldStyle: React.CSSProperties = {
  background: "#ffffff",
  borderColor: "rgba(18,36,28,0.18)",
  color: C.forest,
};

const label = "block text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5";

const Btn = ({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) => (
  <button
    type="submit"
    disabled={disabled}
    className="w-full rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-transform hover:scale-[1.02] disabled:opacity-60"
    style={{ background: C.clay, color: "#fff" }}
  >
    {children}
  </button>
);

const Done = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center text-center gap-3 py-6">
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full"
      style={{ background: C.moss }}
    >
      <Check className="h-6 w-6" style={{ color: C.gold }} />
    </div>
    <p className="text-base font-semibold" style={{ color: C.forest }}>
      {message}
    </p>
  </div>
);

/* ------------------------------- schemas ------------------------------- */

const sponsorSchema = z.object({
  full_name: z.string().trim().min(1, "Your name is required").max(100),
  company: z.string().trim().min(1, "Company is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().max(1000).optional(),
});

const applicantSchema = z.object({
  full_name: z.string().trim().min(1, "Your name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional(),
  role_title: z.string().trim().max(120).optional(),
  linkedin_url: z
    .string()
    .trim()
    .max(300)
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), "Start the link with https://"),
});

const waitlistSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  campus: z.string().trim().max(140).optional(),
});

/* --------------------------- sponsor inquiry --------------------------- */

export const SponsorInquiryDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [form, setForm] = useState({ full_name: "", company: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = sponsorSchema.safeParse(form);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ background: C.cream }}>
        <DialogHeader>
          <DialogTitle style={{ color: C.forest }}>Talk to us about sponsoring</DialogTitle>
        </DialogHeader>
        {done ? (
          <Done message="Thanks. We'll be in touch within a few days." />
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <span className={label} style={{ color: C.moss }}>Name</span>
              <input className={field} style={fieldStyle} value={form.full_name} maxLength={100}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <span className={label} style={{ color: C.moss }}>Company</span>
              <input className={field} style={fieldStyle} value={form.company} maxLength={120}
                onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <span className={label} style={{ color: C.moss }}>Email</span>
              <input type="email" className={field} style={fieldStyle} value={form.email} maxLength={255}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <span className={label} style={{ color: C.moss }}>Message</span>
              <textarea rows={4} className={field} style={fieldStyle} value={form.message} maxLength={1000}
                onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            {error && <p className="text-xs font-semibold" style={{ color: C.clay }}>{error}</p>}
            <Btn disabled={busy}>{busy ? "Sending" : "Send"}</Btn>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ---------------------------- mentor applicant ---------------------------- */

export const MentorApplyDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company: "",
    role_title: "",
    linkedin_url: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = applicantSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error: dbError } = await (supabase as any)
      .from("hbcu_mentor_applicants")
      .insert(parsed.data);
    setBusy(false);
    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ background: C.cream }}>
        <DialogHeader>
          <DialogTitle style={{ color: C.forest }}>Apply to mentor</DialogTitle>
        </DialogHeader>
        {done ? (
          <Done message="You're on the list. We'll follow up as the mentor matching opens." />
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <span className={label} style={{ color: C.moss }}>Name</span>
              <input className={field} style={fieldStyle} value={form.full_name} maxLength={100}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <span className={label} style={{ color: C.moss }}>Email</span>
              <input type="email" className={field} style={fieldStyle} value={form.email} maxLength={255}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className={label} style={{ color: C.moss }}>Company</span>
                <input className={field} style={fieldStyle} value={form.company} maxLength={120}
                  onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <span className={label} style={{ color: C.moss }}>Current role</span>
                <input className={field} style={fieldStyle} value={form.role_title} maxLength={120}
                  onChange={(e) => setForm({ ...form, role_title: e.target.value })} />
              </div>
            </div>
            <div>
              <span className={label} style={{ color: C.moss }}>LinkedIn (optional)</span>
              <input className={field} style={fieldStyle} value={form.linkedin_url} maxLength={300}
                placeholder="https://www.linkedin.com/in/..."
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
            </div>
            {error && <p className="text-xs font-semibold" style={{ color: C.clay }}>{error}</p>}
            <Btn disabled={busy}>{busy ? "Sending" : "Apply to mentor"}</Btn>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* --------------------------- student waitlist --------------------------- */

export const StudentWaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [campus, setCampus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = waitlistSchema.safeParse({ email, campus });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error: dbError } = await (supabase as any)
      .from("hbcu_mentor_student_waitlist")
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
      <p className="text-sm font-semibold" style={{ color: C.gold }}>
        You're on the list. We'll email you when the quiz opens.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
      <input
        type="email"
        value={email}
        maxLength={255}
        placeholder="you@campus.edu"
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-full px-5 py-3 text-sm outline-none"
        style={{ background: "rgba(245,239,227,0.95)", color: C.forest }}
      />
      <input
        value={campus}
        maxLength={140}
        placeholder="Your campus (optional)"
        onChange={(e) => setCampus(e.target.value)}
        className="flex-1 rounded-full px-5 py-3 text-sm outline-none"
        style={{ background: "rgba(245,239,227,0.95)", color: C.forest }}
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-transform hover:scale-[1.02] disabled:opacity-60"
        style={{ background: C.gold, color: C.forest }}
      >
        {busy ? "Sending" : "Notify me"}
      </button>
      {error && <p className="text-xs font-semibold" style={{ color: C.gold }}>{error}</p>}
    </form>
  );
};
