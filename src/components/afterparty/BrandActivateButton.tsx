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
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);

  // Check whether this attendee has previously submitted an activation request
  useEffect(() => {
    if (!hideIfAlreadySent || !attendeeId) return;
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
  }, [attendeeId, hideIfAlreadySent]);


  const submit = async () => {
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
        email: email || null,
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
          idempotencyKey: `${idempotencyBase}-alert`,
          templateData: {
            fullName,
            company: company || undefined,
            email: email || undefined,
            message: message.trim() || undefined,
            attendeeId: attendeeId || undefined,
            submittedAt: `${submittedAt} PT`,
          },
        },
      });

      if (email) {
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "brand-activation-confirmation",
            recipientEmail: email,
            idempotencyKey: `${idempotencyBase}-confirm`,
            templateData: {
              recipientName: fullName.split(" ")[0] || fullName,
              afterPartyUrl: afterPartyUrl || (typeof window !== "undefined" ? window.location.href : undefined),
            },
          },
        });
      }

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

  // Already submitted previously and caller wants it hidden — render nothing
  if (alreadySent && !done) return null;

  if (done) {
    return (
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-2 text-[13px]"
        style={{
          backgroundColor: "rgba(237,118,96,0.12)",
          border: `1px solid ${CORAL}`,
          color: CREAM,
        }}
      >
        <Check className="w-4 h-4" style={{ color: CORAL }} />
        Request received, Jenna will be in touch shortly.
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
        Activate my brand at the After Party
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
        Activate my brand →
      </Button>
    </div>
  );
};

export default BrandActivateButton;
