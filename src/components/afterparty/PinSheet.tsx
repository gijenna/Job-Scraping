import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { requestPin, verifyPin, verifyPhonePin } from "@/services/auth";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  slug: string;
  onSuccess: (attendeeId: string) => void;
  onClose: () => void;
}

const RESEND_SECONDS = 60;

const PinSheet = ({ open, slug, onSuccess, onClose }: Props) => {
  // mode: 'phone' (default) | 'email-intro' | 'email-code'
  const [mode, setMode] = useState<"phone" | "email-intro" | "email-code">("phone");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [noEmail, setNoEmail] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) {
      setMode("phone");
      setSending(false);
      setVerifying(false);
      setMaskedEmail(null);
      setDigits(["", "", "", ""]);
      setError(null);
      setNoEmail(false);
      setCooldown(0);
    }
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-focus first box whenever we land on a code-entry mode
  useEffect(() => {
    if (mode === "phone" || mode === "email-code") {
      setTimeout(() => inputs.current[0]?.focus(), 60);
    }
  }, [mode]);

  const handleSendEmail = async () => {
    setSending(true);
    setError(null);
    const r = await requestPin(slug);
    setSending(false);
    if (!r.ok) {
      if (r.reason === "no_email") { setNoEmail(true); return; }
      if (r.reason === "locked") { setError("Too many attempts. Try again in 30 minutes."); return; }
      setError("Couldn't send the code. Try again in a moment.");
      return;
    }
    setMaskedEmail(r.masked_email || null);
    setMode("email-code");
    setCooldown(RESEND_SECONDS);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setDigits(["", "", "", ""]);
    setError(null);
    await handleSendEmail();
  };

  const handleDigit = (idx: number, v: string) => {
    const cleaned = v.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...digits];
    next[idx] = cleaned;
    setDigits(next);
    if (cleaned && idx < 3) inputs.current[idx + 1]?.focus();
    if (next.every((d) => d.length === 1)) {
      submitCode(next.join(""));
    }
  };

  const handleKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
    if (text.length === 4) {
      e.preventDefault();
      const next = text.split("");
      setDigits(next);
      submitCode(text);
    }
  };

  const submitCode = async (code: string) => {
    setVerifying(true);
    setError(null);

    if (mode === "phone") {
      const r = await verifyPhonePin(slug, code);
      setVerifying(false);
      if (!r.ok) {
        if (r.reason === "no_phone") {
          // Fallback: this attendee predates phone auth. Offer email code.
          setError(null);
          setMode("email-intro");
          return;
        }
        if (r.reason === "locked") {
          setError("Too many tries. Locked for 30 minutes.");
          setDigits(["", "", "", ""]);
          return;
        }
        setError("That didn't match. Try again.");
        setDigits(["", "", "", ""]);
        setTimeout(() => inputs.current[0]?.focus(), 30);
        return;
      }
      onSuccess(r.attendee_id!);
      return;
    }

    // email-code path
    const r = await verifyPin(slug, code);
    setVerifying(false);
    if (!r.ok) {
      setError("That code didn't work. Try again or send a new one.");
      setDigits(["", "", "", ""]);
      setTimeout(() => inputs.current[0]?.focus(), 30);
      return;
    }
    onSuccess(r.attendee_id!);
  };

  const headingFor = () => {
    if (mode === "phone") return "Enter your code";
    if (mode === "email-intro") return "Verify it's you";
    return "Enter your code";
  };

  const descFor = () => {
    if (mode === "phone") return "Last 4 digits of the phone number on your card.";
    if (mode === "email-intro") return "No phone on file for this card. We'll send a 4-digit code to your email instead.";
    return maskedEmail
      ? `Sent to ${maskedEmail}. Valid for 10 minutes.`
      : "Sent. Valid for 10 minutes.";
  };

  const showCodeInputs = mode === "phone" || mode === "email-code";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-[420px] border-0 p-0 overflow-hidden"
        style={{ backgroundColor: "#111111", color: "#fff" }}
      >
        <div className="p-6">
          <DialogHeader>
            <DialogTitle style={{ color: "#fff", fontWeight: 500 }}>{headingFor()}</DialogTitle>
            <DialogDescription style={{ color: "rgba(255,255,255,0.65)" }}>
              {descFor()}
            </DialogDescription>
          </DialogHeader>

          {mode === "email-intro" && (
            <div className="mt-6 space-y-3">
              {noEmail ? (
                <div className="text-sm" style={{ color: "#F5C4B3" }}>
                  We don't have an email or phone for this card. Reach out to the organizer.
                </div>
              ) : (
                <Button
                  onClick={handleSendEmail}
                  disabled={sending}
                  className="w-full"
                  style={{ backgroundColor: "#fff", color: "#080808" }}
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send code
                </Button>
              )}
              {error && <p className="text-xs" style={{ color: "#D85A30" }}>{error}</p>}
            </div>
          )}

          {showCodeInputs && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digits[i]}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKey(i, e)}
                    onPaste={handlePaste}
                    disabled={verifying}
                    className="text-center text-[28px] font-mono rounded-lg outline-none transition-colors"
                    style={{
                      width: 60,
                      height: 64,
                      backgroundColor: "#080808",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  />
                ))}
              </div>

              {verifying && (
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying…
                </div>
              )}

              {error && <p className="text-xs text-center" style={{ color: "#D85A30" }}>{error}</p>}

              {mode === "email-code" && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || sending}
                    className="text-xs underline disabled:opacity-50"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? "Sending…" : "Didn't get it? Resend"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinSheet;
