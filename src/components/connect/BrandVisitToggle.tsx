// "I visited this brand" toggle for the brand modal. Creates a brand-level
// connection row (no rep) when on, deletes that exact row when toggled off.
// Has a small expandable section for adding visit-level notes + selecting
// which reps the candidate spoke to (each becomes its own empty connection).

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  connectionsList, connectionsCreate, connectionsUpdate, connectionsDelete,
} from "@/lib/connect-session";
import { Expert } from "@/lib/expert-types";

interface Props {
  brand: { id: string; name: string };
  reps: Expert[];
  onChanged?: () => void;
}

const BrandVisitToggle = ({ brand, reps, onChanged }: Props) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [visit, setVisit] = useState<any | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedReps, setSelectedReps] = useState<Set<string>>(new Set());
  const [privateNotes, setPrivateNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  const refresh = async () => {
    try {
      const { connections } = await connectionsList();
      const match = (connections || []).find(
        (c: any) => c.brand_id === brand.id && !c.brand_rep_id && !c.expert_id,
      );
      setVisit(match || null);
      if (match) {
        setPrivateNotes(match.private_notes || "");
        setFollowUp(match.follow_up_direction || "");
      }
    } catch {}
  };

  useEffect(() => { refresh(); }, [brand.id]);

  const isVisited = !!visit;

  const toggle = async () => {
    if (busy) return;
    if (isVisited) {
      setConfirmRemove(true);
      return;
    }
    setBusy(true);
    try {
      await connectionsCreate({ brand_id: brand.id });
      await refresh();
      onChanged?.();
    } catch (e: any) {
      toast({ title: "Could not save", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const removeVisit = async () => {
    if (!visit) return;
    setBusy(true);
    try {
      await connectionsDelete(visit.id);
      setVisit(null);
      setExpanded(false);
      setConfirmRemove(false);
      onChanged?.();
    } catch (e: any) {
      toast({ title: "Could not remove", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const saveDetails = async () => {
    if (!visit) return;
    setBusy(true);
    try {
      await connectionsUpdate(visit.id, {
        private_notes: privateNotes || undefined,
        follow_up_direction: followUp || undefined,
      });
      // Create empty connection rows for each newly-selected rep.
      const { connections } = await connectionsList();
      const existingRepIds = new Set(
        (connections || [])
          .filter((c: any) => c.brand_id === brand.id && c.brand_rep_id)
          .map((c: any) => c.brand_rep_id),
      );
      const toCreate = [...selectedReps].filter((id) => !existingRepIds.has(id));
      for (const repId of toCreate) {
        await connectionsCreate({ brand_id: brand.id, brand_rep_id: repId });
      }
      toast({ title: "Visit saved" });
      setExpanded(false);
      setSelectedReps(new Set());
      onChanged?.();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-events-cream/10 bg-events-cream/5 p-3">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 font-display uppercase tracking-wider text-sm transition-colors ${
          isVisited
            ? "bg-events-coral/20 text-events-coral border border-events-coral/40"
            : "bg-events-cream text-events-teal hover:bg-events-cream/90"
        }`}
      >
        {isVisited ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
        {isVisited ? "Visited ✓" : "I visited this brand"}
      </button>

      {isVisited && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between mt-2 px-1 text-[11px] font-body text-events-cream/65 hover:text-events-cream"
        >
          <span>Want to add notes about your visit? Tap to expand.</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}

      <AnimatePresence>
        {expanded && isVisited && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {reps.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-display text-events-cream/60 mb-2">
                    Who did you talk to? (optional)
                  </div>
                  <p className="text-[11px] text-events-cream/50 font-body mb-2">
                    Tap any reps you talked to. Each becomes its own connection record so you can add notes per person later.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reps.map((r) => {
                      const sel = selectedReps.has(r.id);
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedReps((prev) => {
                            const next = new Set(prev);
                            if (sel) next.delete(r.id); else next.add(r.id);
                            return next;
                          })}
                          className={`flex flex-col items-center gap-1 w-14 ${sel ? "opacity-100" : "opacity-70"}`}
                        >
                          <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${sel ? "border-events-coral" : "border-events-cream/20"} bg-events-cream/10 flex items-center justify-center`}>
                            {r.photo_url ? (
                              <img src={r.photo_url} alt={r.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-display text-events-cream/70">
                                {r.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-body text-events-cream/70 line-clamp-1 text-center">
                            {r.full_name.split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-display text-events-cream block mb-1">
                  What did you talk about?
                </label>
                <p className="text-[11px] text-events-cream/50 font-body mb-1.5">
                  Captures the room and vibe. Brand will never see this.
                </p>
                <Textarea
                  value={privateNotes} maxLength={500} rows={3}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40"
                />
              </div>

              <div>
                <label className="text-sm font-display text-events-cream block mb-1">
                  How should you follow up?
                </label>
                <Input
                  value={followUp} maxLength={280}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40"
                />
              </div>

              <Button
                onClick={saveDetails}
                disabled={busy}
                className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
              >
                Save visit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {confirmRemove && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setConfirmRemove(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-events-teal border border-events-cream/15 text-events-cream rounded-2xl p-5 max-w-sm w-full space-y-3">
            <h4 className="font-display text-lg">Remove this visit?</h4>
            <p className="text-sm font-body text-events-cream/70">
              This removes your brand-level visit record. Notes you saved on individual reps stay.
            </p>
            <div className="flex gap-2">
              <Button onClick={removeVisit} disabled={busy} className="flex-1 bg-events-coral text-events-cream">
                Remove
              </Button>
              <Button variant="ghost" onClick={() => setConfirmRemove(false)} className="text-events-cream/70">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandVisitToggle;
