import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AfterPartyAttendee, computeAllMatches } from "@/lib/afterparty-matching";
import { Copy, Lock, RefreshCw, Trash2, Mail, Loader2, Check, X, Pencil, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import AfterPartyCsvSeed from "./AfterPartyCsvSeed";
import AfterPartyLinkBuilder from "./AfterPartyLinkBuilder";
import AfterPartyTestMatches from "./AfterPartyTestMatches";
import AfterPartyPartnersAdmin from "./AfterPartyPartnersAdmin";
import AfterPartySpotlightsAdmin from "./AfterPartySpotlightsAdmin";

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkInvitedBy, setBulkInvitedBy] = useState("");
  const [editingInvitedBy, setEditingInvitedBy] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: a }, { data: m }, sugRes] = await Promise.all([
      (supabase as any).from("afterparty_attendees").select("*").order("attendee_number"),
      (supabase as any).from("afterparty_matches").select("id").eq("locked", true),
      supabase.functions.invoke("afterparty-admin", { body: { action: "list_suggestions" } }),
    ]);
    setAttendees((a as AfterPartyAttendee[]) || []);
    setLockedCount((m as any[])?.length || 0);
    const sugData = (sugRes as any)?.data;
    setSuggestions((sugData?.suggestions as Suggestion[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const callAdmin = async (action: string, payload: any = {}) => {
    const { data, error } = await supabase.functions.invoke("afterparty-admin", {
      body: { action, payload },
    });
    if (error) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
      return null;
    }
    return data;
  };

  const lockMatches = async () => {
    if (!confirm("Lock matches? This freezes everyone's top 5 and shows them as final on the invite page.")) return;
    setWorking(true);
    const matches = computeAllMatches(attendees, 5);
    const res = await callAdmin("lock_matches", { matches });
    setWorking(false);
    if (res) {
      toast({ title: "Matches locked", description: `${(res as any).count ?? matches.length} match rows saved.` });
      fetchAll();
    }
  };

  const unlockMatches = async () => {
    if (!confirm("Unlock matches? Page will go back to live computation.")) return;
    const res = await callAdmin("unlock_matches");
    if (res) {
      toast({ title: "Unlocked" });
      fetchAll();
    }
  };

  const deleteAttendee = async (id: string) => {
    if (!confirm("Delete this attendee?")) return;
    const res = await callAdmin("delete_attendee", { id });
    if (res) fetchAll();
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === attendees.length ? new Set() : new Set(attendees.map((a) => a.id))
    );
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} attendee${ids.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setWorking(true);
    let ok = 0;
    let fail = 0;
    for (const id of ids) {
      const res = await callAdmin("delete_attendee", { id });
      res ? ok++ : fail++;
    }
    setWorking(false);
    setSelected(new Set());
    toast({ title: "Bulk delete complete", description: `Deleted ${ok}${fail ? ` · Failed ${fail}` : ""}` });
    fetchAll();
  };

  const bulkCopyLinks = () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    const urls = attendees
      .filter((a) => ids.includes(a.id))
      .map((a) => `${PUBLISHED_BASE}/afterparty/${slugify(a.full_name)}`)
      .join("\n");
    navigator.clipboard.writeText(urls);
    toast({ title: `Copied ${ids.length} link${ids.length === 1 ? "" : "s"}` });
  };

  const bulkSetInvitedBy = async () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    const value = bulkInvitedBy.trim();
    if (!confirm(`Set "Invited by" to "${value || "(empty)"}" for ${ids.length} attendee${ids.length === 1 ? "" : "s"}?`)) return;
    setWorking(true);
    const { error } = await (supabase as any)
      .from("afterparty_attendees")
      .update({ invited_by: value || null })
      .in("id", ids);
    setWorking(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Updated ${ids.length} attendee${ids.length === 1 ? "" : "s"}` });
    setBulkInvitedBy("");
    setSelected(new Set());
    fetchAll();
  };

  const saveInvitedBy = async (id: string) => {
    const value = editValue.trim();
    const { error } = await (supabase as any)
      .from("afterparty_attendees")
      .update({ invited_by: value || null })
      .eq("id", id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    setEditingInvitedBy(null);
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
    const r = await callAdmin("send_match_emails");
    setWorking(false);
    if (r) {
      toast({
        title: "Match emails queued",
        description: `Sent: ${(r as any)?.sent ?? 0} · Skipped: ${(r as any)?.skipped ?? 0}${(r as any)?.errors?.length ? ` · Errors: ${(r as any).errors.length}` : ""}`,
      });
    }
  };

  const reviewSuggestion = async (id: string, status: "approved" | "rejected") => {
    const r = await callAdmin("review_suggestion", { id, status });
    if (r) {
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      toast({ title: status === "approved" ? "Approved" : "Rejected" });
    }
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
        <Button onClick={downloadAllLinksCsv} variant="outline" className="border-events-cream/30 text-events-cream">
          <Download className="w-4 h-4 mr-2" /> Download all links CSV
        </Button>
        <span className="text-xs text-events-cream/50 ml-auto">
          {attendees.length} attendees · {lockedCount > 0 ? `${lockedCount} locked match rows` : "matches are live"}
        </span>
      </div>

      <AfterPartyLinkBuilder onCreated={fetchAll} />

      <AfterPartyCsvSeed onImported={fetchAll} />

      <AfterPartyPartnersAdmin />

      <AfterPartySpotlightsAdmin />

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
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-events-coral/15 border-b border-events-cream/10 text-sm text-events-cream">
            <span className="font-bold">{selected.size} selected</span>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="text-events-cream/70 hover:text-events-cream">
              Clear
            </Button>
            <div className="flex items-center gap-1.5 ml-2">
              <Input
                value={bulkInvitedBy}
                onChange={(e) => setBulkInvitedBy(e.target.value)}
                placeholder='Set invited by (e.g. "Basecamp")'
                className="h-8 text-xs bg-black/20 border-events-cream/20 text-events-cream w-56"
              />
              <Button size="sm" variant="outline" onClick={bulkSetInvitedBy} disabled={working} className="border-events-cream/30 text-events-cream">
                Apply
              </Button>
            </div>
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" onClick={bulkCopyLinks} className="border-events-cream/30 text-events-cream">
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy links
              </Button>
              <Button size="sm" onClick={bulkDelete} disabled={working} className="bg-red-500/80 hover:bg-red-500 text-events-cream">
                {working ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Trash2 className="w-3.5 h-3.5 mr-1" />}
                Delete selected
              </Button>
            </div>
          </div>
        )}
        <table className="w-full text-sm text-events-cream">
          <thead className="bg-events-cream/5">
            <tr>
              <th className="text-left px-3 py-2 w-8">
                <Checkbox
                  checked={attendees.length > 0 && selected.size === attendees.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="text-left px-3 py-2">#</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Role</th>
              <th className="text-left px-3 py-2">Brand / Niche</th>
              <th className="text-left px-3 py-2">Email</th>
              <th className="text-left px-3 py-2">Invited by</th>
              <th className="text-right px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a) => (
              <tr key={a.id} className={`border-t border-events-cream/10 ${selected.has(a.id) ? "bg-events-coral/10" : ""}`}>
                <td className="px-3 py-2">
                  <Checkbox
                    checked={selected.has(a.id)}
                    onCheckedChange={() => toggleOne(a.id)}
                    aria-label={`Select ${a.full_name}`}
                  />
                </td>
                <td className="px-3 py-2 font-mono text-events-yellow">#{a.attendee_number}</td>
                <td className="px-3 py-2 font-bold">{a.full_name}</td>
                <td className="px-3 py-2 capitalize text-events-cream/70">{a.role}</td>
                <td className="px-3 py-2 text-events-cream/70">
                  {a.role === "brand" ? a.company || ", " : (a.niches?.slice(0, 2).join(", ") || ", ")}
                </td>
                <td className="px-3 py-2 text-events-cream/60">{a.email || ", "}</td>
                <td className="px-3 py-2 text-events-cream/70">
                  {editingInvitedBy === a.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveInvitedBy(a.id);
                          if (e.key === "Escape") setEditingInvitedBy(null);
                        }}
                        placeholder='e.g. "Basecamp"'
                        className="h-7 text-xs bg-black/20 border-events-cream/20 text-events-cream w-32"
                      />
                      <Button size="sm" variant="ghost" onClick={() => saveInvitedBy(a.id)} className="text-green-400 h-7 px-1.5">
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingInvitedBy(null)} className="text-events-cream/50 h-7 px-1.5">
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEditingInvitedBy(a.id); setEditValue((a as any).invited_by || ""); }}
                      className="inline-flex items-center gap-1 hover:text-events-cream"
                    >
                      <span>{(a as any).invited_by || <span className="text-events-cream/30">—</span>}</span>
                      <Pencil className="w-3 h-3 opacity-50" />
                    </button>
                  )}
                </td>
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
              <tr><td colSpan={8} className="px-3 py-8 text-center text-events-cream/50">No attendees yet. Share an invite link.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AfterPartyAdmin;
