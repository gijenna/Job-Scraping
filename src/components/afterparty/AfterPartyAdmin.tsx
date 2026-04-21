import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AfterPartyAttendee, computeAllMatches } from "@/lib/afterparty-matching";
import { Copy, Lock, RefreshCw, Trash2, Mail, Loader2, Check, X } from "lucide-react";
import AfterPartyCsvSeed from "./AfterPartyCsvSeed";
import AfterPartyTestMatches from "./AfterPartyTestMatches";

interface Suggestion {
  id: string;
  kind: "niche" | "looking_for";
  value: string;
  attendee_name: string | null;
  status: string;
  created_at: string;
}

const PUBLISHED_BASE = "https://basecampoutdoorevents.com";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AfterPartyAdmin = () => {
  const { toast } = useToast();
  const [attendees, setAttendees] = useState<AfterPartyAttendee[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [lockedCount, setLockedCount] = useState(0);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: a }, { data: m }, { data: s }] = await Promise.all([
      (supabase as any).from("afterparty_attendees").select("*").order("attendee_number"),
      (supabase as any).from("afterparty_matches").select("id").eq("locked", true),
      (supabase as any).from("afterparty_suggestions").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    ]);
    setAttendees((a as AfterPartyAttendee[]) || []);
    setLockedCount((m as any[])?.length || 0);
    setSuggestions((s as Suggestion[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const lockMatches = async () => {
    if (!confirm("Lock matches? This freezes everyone's top 5 and shows them as final on the invite page.")) return;
    setWorking(true);
    const matches = computeAllMatches(attendees, 5);
    // Wipe previous locked
    await (supabase as any).from("afterparty_matches").delete().eq("locked", true);
    if (matches.length) {
      const rows = matches.map((m) => ({ ...m, locked: true }));
      const { error } = await (supabase as any).from("afterparty_matches").insert(rows);
      if (error) {
        toast({ title: "Lock failed", description: error.message, variant: "destructive" });
        setWorking(false);
        return;
      }
    }
    toast({ title: "Matches locked", description: `${matches.length} match rows saved.` });
    fetchAll();
    setWorking(false);
  };

  const unlockMatches = async () => {
    if (!confirm("Unlock matches? Page will go back to live computation.")) return;
    await (supabase as any).from("afterparty_matches").delete().eq("locked", true);
    toast({ title: "Unlocked" });
    fetchAll();
  };

  const deleteAttendee = async (id: string) => {
    if (!confirm("Delete this attendee?")) return;
    await (supabase as any).from("afterparty_attendees").delete().eq("id", id);
    fetchAll();
  };

  const copyLink = (a: AfterPartyAttendee) => {
    const url = `${PUBLISHED_BASE}/afterparty/${slugify(a.full_name)}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied", description: url });
  };

  const sendEmails = async () => {
    if (!confirm("Send match emails to every attendee with an email on file? This sends one email per person.")) return;
    setWorking(true);
    const { data, error } = await supabase.functions.invoke("send-afterparty-matches", { body: {} });
    setWorking(false);
    if (error) {
      toast({ title: "Send failed", description: error.message, variant: "destructive" });
      return;
    }
    const r = data as any;
    toast({
      title: "Match emails queued",
      description: `Sent: ${r?.sent ?? 0} · Skipped (no email/no matches): ${r?.skipped ?? 0}${r?.errors?.length ? ` · Errors: ${r.errors.length}` : ""}`,
    });
  };

  const reviewSuggestion = async (id: string, status: "approved" | "rejected") => {
    await (supabase as any)
      .from("afterparty_suggestions")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    toast({ title: status === "approved" ? "Approved" : "Rejected" });
  };

  if (loading) return <p className="text-events-cream/60 text-center py-12">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={lockMatches} disabled={working || !attendees.length} className="bg-events-coral text-events-cream">
          {working ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
          Lock matches
        </Button>
        {lockedCount > 0 && (
          <Button onClick={unlockMatches} variant="outline" className="border-events-cream/30 text-events-cream">
            <RefreshCw className="w-4 h-4 mr-2" /> Unlock (go live)
          </Button>
        )}
        <Button onClick={sendEmails} variant="outline" className="border-events-cream/30 text-events-cream">
          <Mail className="w-4 h-4 mr-2" /> Send match emails
        </Button>
        <span className="text-xs text-events-cream/50 ml-auto">
          {attendees.length} attendees · {lockedCount > 0 ? `${lockedCount} locked match rows` : "matches are live"}
        </span>
      </div>

      <AfterPartyCsvSeed onImported={fetchAll} />

      <AfterPartyTestMatches />

      {suggestions.length > 0 && (
        <div className="rounded-xl border border-events-yellow/30 bg-events-yellow/5 p-4">
          <h3 className="font-display font-bold text-events-cream mb-3">
            Pending suggestions ({suggestions.length})
          </h3>
          <div className="space-y-2">
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-sm text-events-cream">
                <span className="px-2 py-0.5 rounded bg-events-cream/10 text-xs uppercase tracking-wider">
                  {s.kind === "niche" ? "Niche" : "Looking for"}
                </span>
                <span className="font-bold">{s.value}</span>
                <span className="text-events-cream/50 text-xs">
                  by {s.attendee_name || "anonymous"}
                </span>
                <div className="ml-auto flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => reviewSuggestion(s.id, "approved")} className="text-green-400 hover:text-green-300">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => reviewSuggestion(s.id, "rejected")} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-events-cream/10 overflow-hidden">
        <table className="w-full text-sm text-events-cream">
          <thead className="bg-events-cream/5">
            <tr>
              <th className="text-left px-3 py-2">#</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Role</th>
              <th className="text-left px-3 py-2">Brand / Niche</th>
              <th className="text-left px-3 py-2">Email</th>
              <th className="text-right px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a) => (
              <tr key={a.id} className="border-t border-events-cream/10">
                <td className="px-3 py-2 font-mono text-events-yellow">#{a.attendee_number}</td>
                <td className="px-3 py-2 font-bold">{a.full_name}</td>
                <td className="px-3 py-2 capitalize text-events-cream/70">{a.role}</td>
                <td className="px-3 py-2 text-events-cream/70">
                  {a.role === "brand" ? a.company || "—" : (a.niches?.slice(0, 2).join(", ") || "—")}
                </td>
                <td className="px-3 py-2 text-events-cream/60">{a.email || "—"}</td>
                <td className="px-3 py-2 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => copyLink(a)} className="text-events-cream/70 hover:text-events-cream">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteAttendee(a.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {!attendees.length && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-events-cream/50">No attendees yet. Share an invite link.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AfterPartyAdmin;
