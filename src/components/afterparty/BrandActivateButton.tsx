import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Check } from "lucide-react";

interface BrandActivateButtonProps {
  attendeeId?: string | null;
  fullName: string;
  company?: string | null;
  email?: string | null;
  /** "compact" hides the message field and shows a single-tap button */
  variant?: "compact" | "full";
  onSubmitted?: () => void;
  /** When true, render nothing if a request was already submitted by this attendee */
  hideIfAlreadySent?: boolean;
  /** Personalized After Party page URL for this attendee (used in confirmation email) */
  afterPartyUrl?: string;
}

const CREAM = "#F5E6D3";
const CORAL = "#ED7660";

const BrandActivateButton = ({
  attendeeId,
  fullName,
  company,
  email,
  variant = "full",
  onSubmitted,
  hideIfAlreadySent = false,
  afterPartyUrl,
}: BrandActivateButtonProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(variant === "full");
  const [message, setMessage] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);

  // Check whether this attendee has previously submitted an activation request.
  // We always check when we have an attendeeId so we can show the "received" state
  // instead of the form on subsequent visits.
  useEffect(() => {
    if (!attendeeId) return;
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("brand_activation_requests")
        .select("id")
        .eq("attendee_id", attendeeId)
        .limit(1);
      if (!cancelled && data && data.length > 0) setAlreadySent(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [attendeeId]);


  const submit = async () => {
    const effectiveEmail = (email || emailInput || "").trim();
    if (!effectiveEmail || !/^\S+@\S+\.\S+$/.test(effectiveEmail)) {
      toast({
        title: "Email required",
        description: "Add your email so Jenna can reply directly to you.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const submittedAt = new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const insertPayload: Record<string, any> = {
        attendee_id: attendeeId || null,
        full_name: fullName,
        company: company || null,
        email: effectiveEmail,
        message: message.trim() || null,
      };

      const { error: insertErr } = await (supabase as any)
        .from("brand_activation_requests")
        .insert(insertPayload);

      if (insertErr) {
        toast({
          title: "Couldn't submit",
          description: insertErr.message,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Fire-and-forget the two emails (don't block the success state on them)
      const idempotencyBase = `brand-activate-${attendeeId || fullName}-${Date.now()}`;

      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "brand-activation-alert",
          recipientEmail: "jenna@wearetheoutdoorindustry.com",
          replyTo: effectiveEmail,
          idempotencyKey: `${idempotencyBase}-alert`,
          templateData: {
            fullName,
            company: company || undefined,
            email: effectiveEmail,
            message: message.trim() || undefined,
            attendeeId: attendeeId || undefined,
            submittedAt: `${submittedAt} PT`,
          },
        },
      });

      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "brand-activation-confirmation",
          recipientEmail: effectiveEmail,
          idempotencyKey: `${idempotencyBase}-confirm`,
          templateData: {
            recipientName: fullName.split(" ")[0] || fullName,
            afterPartyUrl: afterPartyUrl || (typeof window !== "undefined" ? window.location.href : undefined),
          },
        },
      });

      setDone(true);
      onSubmitted?.();
      toast({
        title: "Request sent ✨",
        description: "Jenna will reach out within one business day.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Already submitted previously — show a confirmation card with a "prompt her" mailto.
  const showSentCard = done || alreadySent;
  if (showSentCard) {
    const subject = encodeURIComponent(
      `After Party brand activation follow-up${company ? `, ${company}` : ""}`,
    );
    const body = encodeURIComponent(
      `Hi Jenna,\n\nFollowing up on my brand activation request${company ? ` for ${company}` : ""}.\n\nThanks,\n${fullName}`,
    );
    return (
      <div
        className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 text-[13px]"
        style={{
          backgroundColor: "rgba(237,118,96,0.12)",
          border: `1px solid ${CORAL}`,
          color: CREAM,
        }}
      >
        <div className="flex items-start gap-2 flex-1">
          <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: CORAL }} />
          <span>Activation request received. Jenna will be in touch shortly, or prompt her here.</span>
        </div>
        <a
          href={`mailto:jenna@wearetheoutdoorindustry.com?subject=${subject}&body=${body}`}
          className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-[12px] hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: CORAL, color: "#fff", fontWeight: 600 }}
        >
          Prompt her here
        </a>
      </div>
    );
  }

  if (variant === "compact" && !open) {
    return (
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:opacity-90"
        style={{ backgroundColor: CORAL, color: "#fff", fontWeight: 600 }}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Get my brand in the room
      </Button>
    );
  }

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        backgroundColor: "rgba(237,118,96,0.08)",
        border: "1px solid rgba(237,118,96,0.45)",
      }}
    >
      <div>
        <div
          className="text-[11px] uppercase mb-1"
          style={{ letterSpacing: "0.1em", color: CORAL, fontWeight: 600 }}
        >
          Brand activation
        </div>
        <div className="font-afterparty text-[16px]" style={{ color: CREAM, fontWeight: 500 }}>
          Want to integrate your brand?
        </div>
        <div className="text-[13px] mt-1" style={{ color: "rgba(245,230,211,0.7)" }}>
          200 of the industry's hottest creators, influencers, and athletes in one place. At least
          know your options.
        </div>
      </div>

      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's the one product or moment you'd love every creator at this party posting about the next day?"
        rows={3}
        maxLength={500}
        style={{
          backgroundColor: "#080808",
          border: "1px solid rgba(245,230,211,0.18)",
          color: "#fff",
        }}
      />

      <Button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="w-full sm:w-auto hover:opacity-90"
        style={{ backgroundColor: CORAL, color: "#fff", fontWeight: 600 }}
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        Get my brand in the room →
      </Button>
    </div>
  );
};

export default BrandActivateButton;
