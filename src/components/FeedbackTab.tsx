import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { brandRepMe, candidateMe } from "@/lib/connect-session";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, Paperclip } from "lucide-react";

/**
 * Yellow tab pinned to the right edge that scrolls with the page.
 * Clicking it opens a small panel that sends an email to Jenna with
 * replyTo = the user's email, so she can just hit Reply in her inbox.
 */
export default function FeedbackTab() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subjectType, setSubjectType] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Try to detect a logged-in user from either session system so the email
  // address is pre-filled.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user;
        if (u?.email && !cancelled) {
          setEmail(u.email);
          const meta: any = u.user_metadata || {};
          if (meta.full_name) setName(meta.full_name);
        }
      } catch {}
      try {
        const r = await brandRepMe();
        const s: any = r?.session?.subject;
        if (s && !cancelled) {
          if (s.email) setEmail((prev) => prev || s.email);
          const full = [s.first_name, s.last_name].filter(Boolean).join(" ");
          if (full) setName((prev) => prev || full);
          setSubjectType((prev) => prev || "employer (brand rep)");
        }
      } catch {}
      try {
        const r = await candidateMe();
        const s: any = r?.session?.subject;
        if (s && !cancelled) {
          if (s.email) setEmail((prev) => prev || s.email);
          const full = [s.first_name, s.last_name].filter(Boolean).join(" ");
          if (full) setName((prev) => prev || full);
          setSubjectType((prev) => prev || "job seeker (candidate)");
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result || ""));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(f);
    });

  const send = async () => {
    if (!message.trim()) {
      toast({ title: "Tell Jenna what's going on", description: "Type a message first.", variant: "destructive" });
      return;
    }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      toast({ title: "Add your email", description: "So Jenna can reply to you.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      let screenshotBase64: string | undefined;
      let screenshotMime: string | undefined;
      if (file) {
        if (file.size > 8 * 1024 * 1024) {
          toast({ title: "Screenshot too big", description: "Please keep it under 8 MB.", variant: "destructive" });
          setSending(false);
          return;
        }
        screenshotBase64 = await fileToBase64(file);
        screenshotMime = file.type || "image/png";
      }
      const { error } = await supabase.functions.invoke("submit-feedback", {
        body: {
          message: message.trim(),
          senderEmail: email.trim(),
          senderName: name.trim(),
          subjectType,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          screenshotBase64,
          screenshotMime,
        },
      });
      if (error) throw error;
      toast({ title: "Sent to Jenna 💌", description: "Thanks! She'll reply to your email." });
      setMessage("");
      setFile(null);
      setOpen(false);
    } catch (e: any) {
      toast({ title: "Couldn't send", description: e?.message || "Try again in a moment.", variant: "destructive" });
    }
    setSending(false);
  };

  return (
    <>
      {/* Pinned tab */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Email Jenna"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-events-yellow text-events-teal font-display uppercase tracking-wider text-xs md:text-sm font-semibold px-3 py-3 rounded-l-lg shadow-lg hover:px-4 hover:bg-events-yellow/90 transition-all"
          style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
        >
          Email Jenna
        </button>
      )}

      {open && (
        <div className="fixed right-3 bottom-3 md:right-5 md:bottom-5 z-50 w-[calc(100vw-1.5rem)] max-w-sm bg-events-cream text-events-teal rounded-2xl shadow-2xl border border-events-teal/15 overflow-hidden">
          <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-2 bg-events-yellow/40">
            <div>
              <div className="font-afterparty text-2xl leading-none text-events-teal">Email Jenna</div>
              <p className="font-body text-xs text-events-teal/80 mt-1 leading-snug">
                Is something not working, or do you have an idea to make this page better? This goes straight to <span className="font-semibold">jenna@wearetheoutdoorindustry.com</span>.
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-events-teal/60 hover:text-events-teal p-1 -mr-1">
              <X size={18} />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="px-2 py-1.5 text-sm rounded-md border border-events-teal/20 bg-white font-body focus:outline-none focus:border-events-coral"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="px-2 py-1.5 text-sm rounded-md border border-events-teal/20 bg-white font-body focus:outline-none focus:border-events-coral"
              />
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please tell me if you're an employer or a job seeker, be as specific as possible, and send a screen shot if you know how!"
              rows={5}
              className="w-full px-3 py-2 text-sm rounded-md border border-events-teal/20 bg-white font-body placeholder:text-events-teal/40 focus:outline-none focus:border-events-coral resize-none"
            />

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-body text-events-teal/70 hover:text-events-coral"
              >
                <Paperclip size={14} />
                {file ? file.name.slice(0, 22) : "Attach screenshot"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending}
                className="inline-flex items-center gap-1.5 bg-events-coral hover:bg-events-coral/90 disabled:opacity-60 text-events-cream text-sm font-display uppercase tracking-wider px-3 py-1.5 rounded-md"
              >
                {sending && <Loader2 size={14} className="animate-spin" />}
                {sending ? "Sending" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
