import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  brandRepMe, brandRepLookup, brandRepAddPhoneAndLogin, brandRepLogin, brandRepLogout,
} from "@/lib/connect-session";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import DashboardWorkspace from "@/components/connect/dashboard/DashboardWorkspace";
import connectLogo from "@/assets/connect-basecamp-outside-days.png";
import signinBg from "@/assets/dashboard-signin-bg.jpg";
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
  const [editCardUrl, setEditCardUrl] = useState<string>("https://basecampoutdoorevents.com/denverreps/");
  const [editSignal, setEditSignal] = useState(0);

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
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h1 className="font-afterparty text-2xl md:text-3xl">Brand Dashboard</h1>
              <div className="flex items-center gap-3 text-xs">
                <a
                  href="/outsidedays26"
                  target="_blank" rel="noopener noreferrer"
                  className="font-body text-events-cream/70 hover:text-events-coral transition-colors"
                >
                  View event map
                </a>
                <button
                  onClick={() => setEditSignal((n) => n + 1)}
                  className="font-body text-events-cream/70 hover:text-events-coral transition-colors bg-transparent border-0 p-0 cursor-pointer"
                >
                  Edit my card
                </button>
                <Button
                  variant="ghost" size="sm"
                  onClick={async () => { await brandRepLogout(); setMe(null); setMode("lookup"); }}
                  className="text-events-cream/70 hover:text-events-cream"
                >Sign out</Button>
              </div>
            </div>
            <DashboardWorkspace rep={me} onEditCardUrl={setEditCardUrl} openEditSignal={editSignal} />
          </div>
        </div>
      </ImpersonationGate>
    );
  }

  return (
    <EditableTextProvider pageSlug="outsidedays26-brand-dashboard">
    <ImpersonationGate>
      <div
        className="min-h-screen text-events-cream px-4 py-8 md:py-14 relative bg-events-teal bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(25,54,59,0.78), rgba(25,54,59,0.92)), url(${signinBg})` }}
      >
        <div className="max-w-md mx-auto space-y-6 relative">
          {/* Branded header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <img src={connectLogo} alt="Outside Days" className="w-full max-w-[260px] h-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" />
            <div className="space-y-1">
              <h1 className="font-afterparty text-4xl">Brand Dashboard</h1>
              <EditableText
                settingKey="brand_dashboard_subtitle"
                defaultText="Denver Outside Days 26"
                as="p"
                className="font-body text-events-cream/70 text-sm"
              />
            </div>
            <EditableText
              settingKey="brand_dashboard_signin_body"
              defaultText="Sign in to view candidates, see who visited your table, and read notes from people who reached out. Your dashboard goes live with the full database after the event."
              as="p"
              className="font-body text-events-cream/80 text-sm leading-relaxed max-w-sm"
            />
          </div>

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

          {mode !== "loading" && (
            <EditableText
              settingKey="brand_dashboard_phone_reassurance"
              defaultText="Your phone number is private. We use the last 4 digits to verify it's you. We never text reps and never share your number."
              as="p"
              className="font-body text-events-cream/55 text-[11px] text-center leading-relaxed px-2"
            />
          )}
        </div>
      </div>
    </ImpersonationGate>
    </EditableTextProvider>
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
