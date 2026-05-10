import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  brandRepMe, brandRepLookup, brandRepAddPhoneAndLogin, brandRepLogin, brandRepLogout,
} from "@/lib/connect-session";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import DashboardWorkspace from "@/components/connect/dashboard/DashboardWorkspace";
import connectLogo from "@/assets/connect-basecamp-outside-days.png";
import EditableText from "@/components/EditableText";
import { EditableTextProvider } from "@/components/EditableTextProvider";

type Mode = "loading" | "lookup" | "add_phone" | "login" | "signed_in";

const BrandDashboard = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("loading");
  const [me, setMe] = useState<any>(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [last4, setLast4] = useState("");
  const [phone, setPhone] = useState("");
  const [repId, setRepId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { session } = await brandRepMe();
        if (session?.subject) { setMe(session.subject); setMode("signed_in"); return; }
      } catch {}
      setMode("lookup");
    })();
  }, []);

  const doLookup = async () => {
    setBusy(true);
    try {
      const r = await brandRepLookup({ first_name: first, last_name: last });
      if (r.ambiguous) {
        toast({ title: "Multiple reps found", description: "Please contact jenna@wearetheoutdoorindustry.com to resolve.", variant: "destructive" });
      } else if (!r.found) {
        toast({ title: "Not found", description: "We couldn't find that brand rep. Double-check the spelling.", variant: "destructive" });
      } else if (r.needs_phone) {
        setRepId(r.rep_id!); setMode("add_phone");
      } else {
        setMode("login");
      }
    } catch (e: any) { toast({ title: "Lookup failed", description: e.message, variant: "destructive" }); }
    setBusy(false);
  };

  const doAddPhone = async () => {
    setBusy(true);
    try {
      const r: any = await brandRepAddPhoneAndLogin({ rep_id: repId!, phone });
      setMe(r.session.subject); setMode("signed_in");
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
    setBusy(false);
  };

  const doLogin = async () => {
    setBusy(true);
    try {
      const r: any = await brandRepLogin({ first_name: first, last_name: last, phone_last_four: last4 });
      if (r.ambiguous) toast({ title: "Multiple matches", description: "Please contact jenna@wearetheoutdoorindustry.com.", variant: "destructive" });
      else if (r.session) { setMe(r.session.subject); setMode("signed_in"); }
      else toast({ title: "Wrong code", description: "Last 4 didn't match.", variant: "destructive" });
    } catch (e: any) { toast({ title: "Sign-in failed", description: e.message, variant: "destructive" }); }
    setBusy(false);
  };

  if (mode === "signed_in" && me) {
    return (
      <ImpersonationGate>
        <div className="min-h-screen bg-events-teal text-events-cream px-4 py-6 md:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-afterparty text-2xl md:text-3xl">Brand Dashboard</h1>
              <Button
                variant="ghost" size="sm"
                onClick={async () => { await brandRepLogout(); setMe(null); setMode("lookup"); }}
                className="text-events-cream/70 hover:text-events-cream"
              >Sign out</Button>
            </div>
            <DashboardWorkspace rep={me} />
          </div>
        </div>
      </ImpersonationGate>
    );
  }

  return (
    <ImpersonationGate>
      <div className="min-h-screen bg-events-teal text-events-cream px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          <h1 className="font-afterparty text-4xl text-center mb-2">Brand Rep</h1>
          <p className="text-center font-body text-events-cream/70 text-sm mb-8">Outside Days, Denver 26</p>

          {mode === "loading" && <div className="text-center font-body text-events-cream/60">Loading...</div>}

          {mode === "lookup" && (
            <Card>
              <p className="text-sm font-body text-events-cream/70">Sign in to your brand rep dashboard.</p>
              <Field label="First name"><Input value={first} onChange={(e) => setFirst(e.target.value)} /></Field>
              <Field label="Last name"><Input value={last} onChange={(e) => setLast(e.target.value)} /></Field>
              <Button onClick={doLookup} disabled={busy || !first || !last} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream">Continue</Button>
            </Card>
          )}

          {mode === "add_phone" && (
            <Card>
              <p className="font-display text-base">One quick step.</p>
              <p className="text-sm font-body text-events-cream/70">We don't have a phone number on file for you yet. Add one so you can sign in next time.</p>
              <Field label="Mobile phone"><Input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555 123 4567" /></Field>
              <Button onClick={doAddPhone} disabled={busy || phone.replace(/[^0-9]/g, "").length < 10} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream">Save and sign in</Button>
            </Card>
          )}

          {mode === "login" && (
            <Card>
              <p className="text-sm font-body text-events-cream/70">Enter the last 4 digits of your phone number.</p>
              <Field label="Last 4 of your phone">
                <Input inputMode="numeric" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/[^0-9]/g, ""))} />
              </Field>
              <Button onClick={doLogin} disabled={busy || last4.length !== 4} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream">Sign in</Button>
            </Card>
          )}
        </div>
      </div>
    </ImpersonationGate>
  );
};

const Card = ({ children }: any) => (
  <div className="space-y-3 bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5">{children}</div>
);
const Field = ({ label, children }: any) => (
  <div>
    <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">{label}</Label>
    {children}
  </div>
);

export default BrandDashboard;
