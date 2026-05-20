import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BasecampMatchPopflyLogo from "@/components/afterparty/BasecampMatchPopflyLogo";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import StarSparkle from "@/components/afterparty/StarSparkle";
import OakleyRinoVenueShowcase from "@/components/afterparty/OakleyRinoVenueShowcase";
import AfterPartySpotlights from "@/components/afterparty/AfterPartySpotlights";
import PartyFeaturesGrid from "@/components/afterparty/PartyFeaturesGrid";
import BrandActivateButton from "@/components/afterparty/BrandActivateButton";
import oakleyCreamLogo from "@/assets/oakley-logo-cream.png";

const OAKLEY_PRESENTER = {
  label: "@",
  sublabel: "RiNo",
  logoUrl: oakleyCreamLogo,
  logoAlt: "Oakley",
  href: "https://www.oakley.com",
  creamGlow: true,
};

const BG = "#080808";
const CREAM = "#F5E6D3";
const CREAM_MUTED = "rgba(245,230,211,0.7)";
const CREAM_DIM = "rgba(245,230,211,0.55)";
const CREAM_FAINT = "rgba(245,230,211,0.45)";
const BORDER = "rgba(255,255,255,0.09)";

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

    supabase.functions.invoke("append-afterparty-interest-sheet", {
      body: payload,
    });

    setDone(true);
    setSubmitting(false);
  };

  const showActivation = done && (attendeeType === "brand" || attendeeType === "industry");

  return (
    <EditableTextProvider pageSlug="afterparty-interest">
      <div
        className="min-h-screen relative bg-cover bg-center md:bg-top"
        style={{
          backgroundColor: BG,
          backgroundImage: "url('/bg-sunset.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: CREAM,
          fontFamily: '"Josefin Sans", sans-serif',
          fontWeight: 300,
        }}
      >
        {/* Darkening overlay */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        />

        <div className="mx-auto px-5 pt-2 pb-16 relative z-10" style={{ maxWidth: 520 }}>
          {/* Lockup */}
          <BasecampMatchPopflyLogo presenter={OAKLEY_PRESENTER} />

          {/* Sparkle row + tagline pill */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-3" aria-hidden="true">
              <StarSparkle tone="coral" size={18} />
              <StarSparkle tone="cream" size={26} />
              <StarSparkle tone="green" size={20} />
              <StarSparkle tone="cream" size={14} />
              <StarSparkle tone="coral" size={22} />
            </div>
            <div
              className="font-afterparty font-bold flex items-center justify-center gap-1.5 sm:gap-2 mb-4 whitespace-nowrap text-[13px] sm:text-base"
              style={{ color: CREAM }}
            >
              <span>DJ</span>
              <StarSparkle tone="green" size={10} />
              <span>Drinks</span>
              <StarSparkle tone="coral" size={10} />
              <span>Food</span>
              <StarSparkle tone="cream" size={10} />
              <span>Fun</span>
            </div>
          </div>

          {/* About the event */}
          <section className="mt-2 px-1">
            <h2
              className="font-afterparty text-[22px] mb-3 text-center"
              style={{ fontWeight: 500, color: CREAM }}
            >
              <EditableText
                settingKey="about.title"
                defaultText="A lil' party for outdoor industry creators & brands"
              />
            </h2>
            <p
              className="text-[14px] leading-[1.55] mb-5 text-center"
              style={{ color: CREAM_MUTED }}
            >
              <EditableText
                settingKey="about.body"
                defaultText="200 of the industry's hottest creators and brands coming together for food, fun, a DJ, and drinks. Proudly sober optional, professional networking guaranteed."
                multiline
              />
            </p>

            {/* Capacity gate */}
            <div
              className="rounded-xl px-4 py-3 mb-5 text-center text-[13px]"
              style={{
                backgroundColor: "rgba(237,118,96,0.10)",
                border: "1px solid rgba(237,118,96,0.45)",
                color: CREAM,
              }}
            >
              <EditableText
                settingKey="interest_capacity_copy"
                defaultText="Due to venue capacity, please submit your interest by May 25."
                as="span"
              />
            </div>

            {!showForm && !done && (
              <div className="flex justify-center">
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
              </div>
            )}
          </section>

          <AnimatePresence mode="wait">
            {showForm && !done && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleSubmit}
                className="mt-8 bg-[#F5E6D3]/[0.06] border border-[#F5E6D3]/15 rounded-2xl p-6 md:p-8 space-y-5 backdrop-blur-sm"
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
                  <p className="text-[11px] text-[#F5E6D3]/50 mt-1">{reason.length}/500</p>
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
                className="mt-8 space-y-6"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                <div className="bg-[#F5E6D3]/[0.06] border border-[#F5E6D3]/15 rounded-2xl p-8 text-center">
                  <h2
                    className="text-2xl md:text-3xl font-light mb-4 text-[#E1B624]"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    <EditableText
                      settingKey="interest_thanks_headline"
                      defaultText="You're on the waitlist."
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
                </div>

                {showActivation && (
                  <div>
                    <BrandActivateButton
                      fullName={fullName}
                      company={company}
                      email={email}
                      variant="full"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Oakley RiNo gallery */}
          <div className="mt-12">
            <OakleyRinoVenueShowcase />
          </div>

          {/* Sponsors */}
          <div className="mt-10">
            <AfterPartySpotlights />
          </div>

          {/* Party Features 6-icon grid (mirrors /afterparty) */}
          <div
            className="mt-8 rounded-xl p-4 sm:p-5"
            style={{
              backgroundColor: "rgba(8,8,8,0.6)",
              border: "1px solid rgba(245,230,211,0.14)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              className="text-[10px] uppercase mb-2 text-center"
              style={{ letterSpacing: "0.18em", color: "#E1B624", fontWeight: 700 }}
            >
              Party Features
            </div>
            <PartyFeaturesGrid guestListScrollsToRoster={false} />
          </div>


          <div className="mt-8 text-center text-[12px]" style={{ color: CREAM_DIM, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            Questions?{" "}
            <a
              href="mailto:jenna@wearetheoutdoorindustry.com"
              style={{ color: "#ED7660", textDecoration: "underline" }}
            >
              jenna@wearetheoutdoorindustry.com
            </a>
          </div>
        </div>
      </div>
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
