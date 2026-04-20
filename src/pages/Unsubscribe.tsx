import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, MailX, Check, AlertCircle } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"checking" | "valid" | "invalid" | "already" | "submitting" | "done" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
          headers: { apikey: ANON_KEY },
        });
        const data = await res.json();
        if (!res.ok) { setState("invalid"); return; }
        if (data.valid === false && data.reason === "already_unsubscribed") setState("already");
        else if (data.valid) setState("valid");
        else setState("invalid");
      } catch (e: any) {
        setState("invalid");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    if (error) { setState("error"); setErrorMsg(error.message); return; }
    if ((data as any)?.success || (data as any)?.reason === "already_unsubscribed") setState("done");
    else setState("error");
  };

  return (
    <div className="min-h-screen bg-events-teal flex items-center justify-center px-6">
      <div className="max-w-md w-full p-8 rounded-2xl bg-events-cream/5 border border-events-cream/10 text-center text-events-cream">
        <MailX className="w-12 h-12 mx-auto mb-4 text-events-coral" />
        {state === "checking" && (<><Loader2 className="w-6 h-6 mx-auto animate-spin" /><p className="mt-4">Checking your link…</p></>)}
        {state === "valid" && (<>
          <h1 className="font-display text-2xl font-bold mb-3">Unsubscribe from emails?</h1>
          <p className="text-events-cream/70 mb-6">You won't receive future emails from us at this address.</p>
          <Button onClick={confirm} className="bg-events-coral text-events-cream hover:bg-events-coral/90">Confirm unsubscribe</Button>
        </>)}
        {state === "submitting" && (<><Loader2 className="w-6 h-6 mx-auto animate-spin" /><p className="mt-4">Unsubscribing…</p></>)}
        {state === "done" && (<>
          <Check className="w-10 h-10 mx-auto text-events-yellow mb-3" />
          <h1 className="font-display text-2xl font-bold mb-2">You're unsubscribed</h1>
          <p className="text-events-cream/70">You won't receive any more emails from us.</p>
        </>)}
        {state === "already" && (<>
          <Check className="w-10 h-10 mx-auto text-events-yellow mb-3" />
          <h1 className="font-display text-2xl font-bold mb-2">Already unsubscribed</h1>
          <p className="text-events-cream/70">This email is no longer on our list.</p>
        </>)}
        {state === "invalid" && (<>
          <AlertCircle className="w-10 h-10 mx-auto text-red-400 mb-3" />
          <h1 className="font-display text-2xl font-bold mb-2">Invalid link</h1>
          <p className="text-events-cream/70">This unsubscribe link is invalid or expired.</p>
        </>)}
        {state === "error" && (<>
          <AlertCircle className="w-10 h-10 mx-auto text-red-400 mb-3" />
          <h1 className="font-display text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-events-cream/70">{errorMsg || "Please try again later."}</p>
        </>)}
      </div>
    </div>
  );
};

export default Unsubscribe;
