import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BasecampMatchPopflyLogo from "@/components/afterparty/BasecampMatchPopflyLogo";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import oakleyCreamLogo from "@/assets/oakley-logo-cream.png";

const OAKLEY_PRESENTER = {
  label: "@",
  sublabel: "RiNo",
  logoUrl: oakleyCreamLogo,
  logoAlt: "Oakley",
  href: "https://www.oakley.com",
  creamGlow: true,
};

type AttendeeType = "brand" | "creator" | "industry";

const TYPE_OPTIONS: { value: AttendeeType; label: string }[] = [
  { value: "brand", label: "Brand" },
  { value: "creator", label: "Creator" },
  { value: "industry", label: "Industry member" },
];

const AfterPartyInterest = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [attendeeType, setAttendeeType] = useState<AttendeeType | "">("");
  const [reason, setReason] = useState("");

  const canSubmit =
    fullName.trim() &&
    /\S+@\S+\.\S+/.test(email.trim()) &&
    company.trim() &&
    roleTitle.trim() &&
    attendeeType &&
    reason.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      role_title: roleTitle.trim(),
      attendee_type: attendeeType as AttendeeType,
      reason: reason.trim(),
    };

    const { error } = await (supabase as any)
      .from("afterparty_interest")
      .insert(payload);

    if (error) {
      toast({
        title: "Couldn't submit",
        description: error.message,
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const idem = `afterparty-interest-${payload.email}-${Date.now()}`;

    // Fire-and-forget: alert email to Jenna
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "afterparty-interest-alert",
        recipientEmail: "jenna@wearetheoutdoorindustry.com",
        replyTo: payload.email,
        idempotencyKey: `${idem}-alert`,
        templateData: {
          fullName: payload.full_name,
          email: payload.email,
          company: payload.company,
          roleTitle: payload.role_title,
          attendeeType: payload.attendee_type,
          reason: payload.reason,
          submittedAt: `${submittedAt} PT`,
        },
      },
    });

    // Fire-and-forget: append to Google Sheet
    supabase.functions.invoke("append-afterparty-interest-sheet", {
      body: payload,
    });

    setDone(true);
    setSubmitting(false);
  };

  return (
    <EditableTextProvider pageSlug="afterparty-interest">
      <main className="min-h-screen bg-[#19363B] text-[#F5E6D3] flex flex-col">
        {/* Hero / lockup */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-10 pb-6">
          <div className="w-full max-w-[640px]">
            <BasecampMatchPopflyLogo presenter={OAKLEY_PRESENTER} />
          </div>
        </section>

        {/* Body */}
        <section className="px-6 pb-16">
          <div className="container mx-auto max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <p
                className="text-[11px] tracking-[0.3em] uppercase mb-4 text-[#E1B624]"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                <EditableText
                  settingKey="interest_eyebrow"
                  defaultText="May 28 · Denver · Outside Days"
                  as="span"
                />
              </p>
              <h1
                className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-[1.1]"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                <EditableText
                  settingKey="interest_headline"
                  defaultText="An evening for the outdoor industry."
                  as="span"
                />
              </h1>
              <p
                className="text-base md:text-lg text-[#F5E6D3]/85 mb-8 leading-relaxed"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                <EditableText
                  settingKey="interest_capacity_copy"
                  defaultText="Due to venue capacity, please submit your interest by May 25."
                  as="span"
                />
              </p>

              {!showForm && !done && (
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl shadow-xl bg-[#ED7660] text-[#19363B] font-bold text-lg"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  <EditableText
                    settingKey="interest_cta_button"
                    defaultText="I wanna come"
                    as="span"
                  />
                </motion.button>
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {showForm && !done && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleSubmit}
                  className="mt-10 bg-[#F5E6D3]/[0.06] border border-[#F5E6D3]/15 rounded-2xl p-6 md:p-8 space-y-5 backdrop-blur-sm"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  <Field label="Full name" value={fullName} onChange={setFullName} />
                  <Field label="Email" type="email" value={email} onChange={setEmail} />
                  <Field label="Company" value={company} onChange={setCompany} />
                  <Field label="Role / title" value={roleTitle} onChange={setRoleTitle} />

                  <div>
                    <Label>I'm coming as a...</Label>
                    <div className="flex flex-wrap gap-2">
                      {TYPE_OPTIONS.map((opt) => {
                        const active = attendeeType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setAttendeeType(opt.value)}
                            className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                              active
                                ? "bg-[#E1B624] text-[#19363B] border-[#E1B624]"
                                : "bg-transparent text-[#F5E6D3] border-[#F5E6D3]/30 hover:border-[#E1B624]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>Why you want to come</Label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value.slice(0, 500))}
                      rows={4}
                      className="w-full bg-[#19363B]/40 border border-[#F5E6D3]/20 rounded-lg px-4 py-3 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:outline-none focus:border-[#E1B624]"
                      placeholder="A sentence or two is plenty."
                    />
                    <p className="text-[11px] text-[#F5E6D3]/50 mt-1">
                      {reason.length}/500
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="w-full px-6 py-4 rounded-xl bg-[#ED7660] text-[#19363B] font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-[#ED7660]/90"
                  >
                    {submitting ? "Sending..." : "I wanna come"}
                  </button>

                  <p className="text-[11px] text-[#F5E6D3]/55 leading-relaxed pt-2">
                    <EditableText
                      settingKey="interest_fineprint"
                      defaultText="By submitting, you're cool with Oakley sending you an email about other fun stuff they're doing in store, and with your likeness being shared if you're captured in a photo at the event."
                      as="span"
                    />
                  </p>
                </motion.form>
              )}

              {done && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 bg-[#F5E6D3]/[0.06] border border-[#F5E6D3]/15 rounded-2xl p-8 text-center"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  <h2
                    className="text-2xl md:text-3xl font-light mb-4 text-[#E1B624]"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    <EditableText
                      settingKey="interest_thanks_headline"
                      defaultText="You're on the list to be considered."
                      as="span"
                    />
                  </h2>
                  <p className="text-[#F5E6D3]/85 leading-relaxed">
                    <EditableText
                      settingKey="interest_thanks_body"
                      defaultText="We'll review every submission and reach out by May 26 with next steps. Keep an eye on your inbox."
                      as="span"
                    />
                  </p>
                  <a
                    href="/events"
                    className="inline-block mt-6 text-sm text-[#ED7660] underline underline-offset-4 hover:text-[#E1B624]"
                  >
                    Back to events
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </EditableTextProvider>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] tracking-[0.18em] uppercase text-[#E1B624] font-semibold mb-2">
    {children}
  </label>
);

const Field = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <div>
    <Label>{label}</Label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#19363B]/40 border border-[#F5E6D3]/20 rounded-lg px-4 py-3 text-[#F5E6D3] placeholder:text-[#F5E6D3]/40 focus:outline-none focus:border-[#E1B624]"
    />
  </div>
);

export default AfterPartyInterest;
