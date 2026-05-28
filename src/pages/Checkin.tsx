import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus, Search, MoreHorizontal, LogOut } from "lucide-react";

type Attendee = {
  id: string;
  attendee_number: number;
  full_name: string;
  company: string | null;
  role: string;
  email: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
};

const ALLOWED_SUFFIXES = ["@popfly.com", "@wearetheoutdoorindustry.com"];
const UNDO_WINDOW_MS = 30_000;

function isAllowedEmail(email: string | null | undefined): boolean {
  const e = (email || "").toLowerCase().trim();
  return ALLOWED_SUFFIXES.some((s) => e.endsWith(s));
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m === 1) return "1 min ago";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return h === 1 ? "1 hr ago" : `${h} hrs ago`;
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `walkin-${Math.random().toString(36).slice(2, 8)}`
  );
}

export default function Checkin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Data
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [query, setQuery] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [undoUntil, setUndoUntil] = useState<Record<string, number>>({});
  const [, setTick] = useState(0);
  const [confirmUncheck, setConfirmUncheck] = useState<Attendee | null>(null);

  // Walk-in
  const [walkinOpen, setWalkinOpen] = useState(false);
  const [wName, setWName] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wCompany, setWCompany] = useState("");
  const [wRole, setWRole] = useState("brand");
  const [wSubmitting, setWSubmitting] = useState(false);

  // Re-render every second so "X min ago" + undo countdown stay fresh
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  // Auth bootstrap
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setUserEmail(session?.user?.email ?? null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const allowed = isAllowedEmail(userEmail);

  // Load + subscribe
  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("afterparty_attendees")
        .select("id, attendee_number, full_name, company, role, email, checked_in_at, checked_in_by")
        .order("attendee_number", { ascending: true })
        .limit(2000);
      if (cancelled) return;
      if (error) {
        toast({ title: "Couldn't load guest list", description: error.message, variant: "destructive" });
        return;
      }
      setAttendees((data || []) as Attendee[]);
    };
    load();

    const channel = supabase
      .channel("checkin-attendees")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "afterparty_attendees" },
        (payload) => {
          setAttendees((prev) => {
            if (payload.eventType === "DELETE") {
              return prev.filter((a) => a.id !== (payload.old as any).id);
            }
            const row = payload.new as Attendee;
            const idx = prev.findIndex((a) => a.id === row.id);
            if (idx === -1) {
              return [...prev, row].sort((a, b) => a.attendee_number - b.attendee_number);
            }
            const next = prev.slice();
            next[idx] = { ...next[idx], ...row };
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [allowed, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!isAllowedEmail(email)) {
        await supabase.auth.signOut();
        throw new Error("This login only works for @popfly.com or @wearetheoutdoorindustry.com emails.");
      }
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async (a: Attendee) => {
    // Optimistic
    const now = new Date().toISOString();
    setAttendees((prev) =>
      prev.map((x) =>
        x.id === a.id ? { ...x, checked_in_at: now, checked_in_by: userEmail } : x
      )
    );
    setUndoUntil((u) => ({ ...u, [a.id]: Date.now() + UNDO_WINDOW_MS }));

    const { error } = await supabase
      .from("afterparty_attendees")
      .update({ checked_in_at: now, checked_in_by: userEmail })
      .eq("id", a.id);
    if (error) {
      toast({ title: "Check-in failed", description: error.message, variant: "destructive" });
      // revert
      setAttendees((prev) =>
        prev.map((x) =>
          x.id === a.id ? { ...x, checked_in_at: a.checked_in_at, checked_in_by: a.checked_in_by } : x
        )
      );
    }
  };

  const uncheck = async (a: Attendee) => {
    const prevState = { at: a.checked_in_at, by: a.checked_in_by };
    setAttendees((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, checked_in_at: null, checked_in_by: null } : x))
    );
    setUndoUntil((u) => {
      const next = { ...u };
      delete next[a.id];
      return next;
    });
    const { error } = await supabase
      .from("afterparty_attendees")
      .update({ checked_in_at: null, checked_in_by: null })
      .eq("id", a.id);
    if (error) {
      toast({ title: "Couldn't undo", description: error.message, variant: "destructive" });
      setAttendees((prev) =>
        prev.map((x) =>
          x.id === a.id ? { ...x, checked_in_at: prevState.at, checked_in_by: prevState.by } : x
        )
      );
    }
  };

  const addWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName.trim() || !wEmail.trim()) return;
    setWSubmitting(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("afterparty_attendees")
        .insert({
          full_name: wName.trim(),
          email: wEmail.trim().toLowerCase(),
          company: wCompany.trim() || null,
          role: wRole,
          slug: `${slugify(wName)}-${Math.random().toString(36).slice(2, 6)}`,
          status: "confirmed",
          checked_in_at: now,
          checked_in_by: userEmail,
        })
        .select()
        .single();
      if (error) throw error;
      toast({ title: `Walked in: #${(data as any).attendee_number}`, description: wName.trim() });
      setWName(""); setWEmail(""); setWCompany(""); setWRole("brand");
      setWalkinOpen(false);
    } catch (err: any) {
      toast({ title: "Couldn't add walk-in", description: err.message, variant: "destructive" });
    } finally {
      setWSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return attendees.filter((a) => {
      if (onlyPending && a.checked_in_at) return false;
      if (!q) return true;
      if (String(a.attendee_number).includes(q)) return true;
      if ((a.full_name || "").toLowerCase().includes(q)) return true;
      if ((a.company || "").toLowerCase().includes(q)) return true;
      if ((a.email || "").toLowerCase().includes(q)) return true;
      return false;
    });
  }, [attendees, query, onlyPending]);

  const totalCount = attendees.length;
  const checkedCount = attendees.filter((a) => !!a.checked_in_at).length;

  // ============ Render ============

  if (!authReady) {
    return (
      <div className="min-h-screen bg-events-teal flex items-center justify-center text-events-cream">
        Loading…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-events-teal flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-events-cream font-display text-3xl font-bold text-center mb-2">
            Door Check-In
          </h1>
          <p className="text-events-cream/60 text-center text-sm mb-8">
            Sign in with the shared <strong>@popfly.com</strong> account.
          </p>
          {userEmail && (
            <p className="text-events-cream/80 text-center text-xs mb-4">
              Signed in as {userEmail}. This email isn't allowed here.
              <button
                className="ml-2 underline"
                onClick={() => supabase.auth.signOut()}
              >
                Sign out
              </button>
            </p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-events-cream">Email</Label>
              <Input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/40"
                placeholder="door@popfly.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-events-cream">Password</Label>
              <Input
                id="password" type="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/40"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit" disabled={loading}
              className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-semibold"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-events-teal text-events-cream pb-32">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-events-teal/95 backdrop-blur border-b border-events-cream/10">
        <div className="max-w-2xl mx-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-display text-2xl font-bold leading-tight">Door Check-In</div>
              <div className="text-xs text-events-cream/60">
                Signed in as {userEmail}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-bold text-events-coral leading-none">
                {checkedCount}<span className="text-events-cream/40 text-xl"> / {totalCount}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-events-cream/60">checked in</div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-events-cream/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search number, name, or company…"
              className="pl-9 bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/40 h-11"
              inputMode="search"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setOnlyPending(false)}
              className={`px-3 py-1.5 rounded-full transition ${!onlyPending ? "bg-events-coral text-events-cream" : "bg-events-card text-events-cream/70"}`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setOnlyPending(true)}
              className={`px-3 py-1.5 rounded-full transition ${onlyPending ? "bg-events-coral text-events-cream" : "bg-events-card text-events-cream/70"}`}
            >
              Not in ({totalCount - checkedCount})
            </button>
            <div className="flex-1" />
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-events-cream/50 hover:text-events-cream text-xs flex items-center gap-1"
              title="Sign out"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center text-events-cream/50 py-12 text-sm">
            No matches. Try a different search, or add a walk-in.
          </div>
        )}
        {filtered.map((a) => {
          const checked = !!a.checked_in_at;
          const undoLeft = checked ? Math.max(0, Math.ceil(((undoUntil[a.id] || 0) - Date.now()) / 1000)) : 0;
          return (
            <div
              key={a.id}
              className={`rounded-xl p-3 flex items-center gap-3 transition ${
                checked
                  ? "bg-events-cream/10 border border-events-cream/10"
                  : "bg-events-card border border-events-cream/10"
              }`}
            >
              <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-display font-bold text-lg ${
                checked ? "bg-events-cream/10 text-events-cream/50" : "bg-events-teal text-events-yellow"
              }`}>
                #{a.attendee_number}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`font-semibold truncate ${checked ? "text-events-cream/70" : "text-events-cream"}`}>
                  {a.full_name}
                </div>
                <div className="text-xs text-events-cream/50 truncate">
                  {a.company || a.email || ""}{a.role ? ` · ${a.role}` : ""}
                </div>
                {checked && a.checked_in_at && (
                  <div className="text-[11px] text-events-cream/40 mt-0.5 flex items-center gap-2">
                    <Check className="h-3 w-3 text-events-coral" />
                    {timeAgo(a.checked_in_at)}
                    {a.checked_in_by ? ` · ${a.checked_in_by.split("@")[0]}` : ""}
                  </div>
                )}
              </div>

              {!checked ? (
                <Button
                  onClick={() => checkIn(a)}
                  className="bg-events-coral hover:bg-events-coral/90 text-events-cream font-semibold h-11 px-5"
                >
                  Check In
                </Button>
              ) : undoLeft > 0 ? (
                <button
                  onClick={() => uncheck(a)}
                  className="text-xs px-3 py-2 rounded-lg bg-events-cream/10 hover:bg-events-cream/20 text-events-cream font-medium"
                >
                  Undo ({undoLeft}s)
                </button>
              ) : (
                <button
                  onClick={() => setConfirmUncheck(a)}
                  className="p-2 rounded-lg hover:bg-events-cream/10 text-events-cream/50"
                  title="Un-check"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Walk-in FAB */}
      <Sheet open={walkinOpen} onOpenChange={setWalkinOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed bottom-6 right-6 z-30 h-14 px-5 rounded-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-semibold shadow-2xl flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Walk-in
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="bg-events-teal border-events-cream/10 text-events-cream">
          <SheetHeader>
            <SheetTitle className="text-events-cream font-display text-2xl">Add walk-in guest</SheetTitle>
          </SheetHeader>
          <form onSubmit={addWalkin} className="space-y-3 mt-4 pb-6">
            <div>
              <Label htmlFor="wName">Full name *</Label>
              <Input id="wName" required value={wName} onChange={(e) => setWName(e.target.value)}
                className="bg-events-card border-events-cream/20 text-events-cream" />
            </div>
            <div>
              <Label htmlFor="wEmail">Email *</Label>
              <Input id="wEmail" type="email" required value={wEmail} onChange={(e) => setWEmail(e.target.value)}
                className="bg-events-card border-events-cream/20 text-events-cream" />
            </div>
            <div>
              <Label htmlFor="wCompany">Company</Label>
              <Input id="wCompany" value={wCompany} onChange={(e) => setWCompany(e.target.value)}
                className="bg-events-card border-events-cream/20 text-events-cream" />
            </div>
            <div>
              <Label>Role</Label>
              <div className="flex gap-2 mt-1">
                {[
                  { v: "brand", l: "Brand" },
                  { v: "creator", l: "Creator" },
                  { v: "other", l: "Other" },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setWRole(opt.v)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      wRole === opt.v ? "bg-events-coral text-events-cream" : "bg-events-card text-events-cream/70"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit" disabled={wSubmitting}
              className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-semibold h-12 mt-2"
            >
              {wSubmitting ? "Adding…" : "Add & Check In"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Uncheck confirm */}
      <AlertDialog open={!!confirmUncheck} onOpenChange={(o) => !o && setConfirmUncheck(null)}>
        <AlertDialogContent className="bg-events-teal border-events-cream/20 text-events-cream">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-events-cream">Un-check this guest?</AlertDialogTitle>
            <AlertDialogDescription className="text-events-cream/70">
              Only use this for mistakes. {confirmUncheck?.full_name} will go back to "not checked in".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-events-card border-events-cream/20 text-events-cream hover:bg-events-card/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmUncheck) uncheck(confirmUncheck);
                setConfirmUncheck(null);
              }}
              className="bg-events-coral hover:bg-events-coral/90 text-events-cream"
            >
              Yes, un-check
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
