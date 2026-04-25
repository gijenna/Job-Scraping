import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Loader2 } from "lucide-react";

const CREAM = "#F5E6D3";
const CREAM_DIM = "rgba(245,230,211,0.55)";
const BORDER = "rgba(255,255,255,0.12)";

interface Suggestion {
  id: string;
  kind: string;
  value: string;
  attendee_name: string | null;
  status: string;
  created_at: string;
}

const SETTING_KEY = "afterparty.extra_niches";
const EVENT_SLUG = "afterparty";

const AfterPartySuggestionsAdmin = () => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [extraNiches, setExtraNiches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: setting }] = await Promise.all([
      (supabase as any)
        .from("afterparty_suggestions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      (supabase as any)
        .from("event_settings")
        .select("id, setting_value")
        .eq("event_slug", EVENT_SLUG)
        .eq("setting_key", SETTING_KEY)
        .maybeSingle(),
    ]);
    setSuggestions((s as Suggestion[]) || []);
    const list = (setting?.setting_value || "")
      .split(",")
      .map((v: string) => v.trim())
      .filter(Boolean);
    setExtraNiches(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveExtra = async (next: string[]) => {
    const value = next.join(", ");
    const { data: existing } = await (supabase as any)
      .from("event_settings")
      .select("id")
      .eq("event_slug", EVENT_SLUG)
      .eq("setting_key", SETTING_KEY)
      .maybeSingle();
    if (existing?.id) {
      await (supabase as any)
        .from("event_settings")
        .update({ setting_value: value })
        .eq("id", existing.id);
    } else {
      await (supabase as any)
        .from("event_settings")
        .insert({ event_slug: EVENT_SLUG, setting_key: SETTING_KEY, setting_value: value });
    }
  };

  const approve = async (s: Suggestion) => {
    setBusyId(s.id);
    const trimmed = s.value.trim();
    // Case-insensitive dedupe
    const exists = extraNiches.some((n) => n.toLowerCase() === trimmed.toLowerCase());
    const nextList = exists ? extraNiches : [...extraNiches, trimmed];
    if (!exists) {
      await saveExtra(nextList);
      setExtraNiches(nextList);
    }
    // Mark this AND all duplicates of this value as reviewed
    await (supabase as any)
      .from("afterparty_suggestions")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("status", "pending")
      .ilike("value", trimmed);
    toast({ title: `Added "${trimmed}"`, description: exists ? "Already in the list — marked reviewed." : "Now selectable in the form." });
    setBusyId(null);
    load();
  };

  const dismiss = async (s: Suggestion) => {
    setBusyId(s.id);
    await (supabase as any)
      .from("afterparty_suggestions")
      .update({ status: "dismissed", reviewed_at: new Date().toISOString() })
      .eq("id", s.id);
    setBusyId(null);
    load();
  };

  const removeExtra = async (n: string) => {
    const next = extraNiches.filter((x) => x !== n);
    await saveExtra(next);
    setExtraNiches(next);
  };

  // Group pending suggestions by lowercase value to count how many people asked
  const grouped = suggestions.reduce<Record<string, Suggestion[]>>((acc, s) => {
    const k = s.value.trim().toLowerCase();
    (acc[k] ||= []).push(s);
    return acc;
  }, {});
  const groups = Object.entries(grouped);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] uppercase mb-2" style={{ letterSpacing: "0.1em", color: CREAM }}>
          Pending niche suggestions
        </div>
        {loading ? (
          <div className="text-[12px]" style={{ color: CREAM_DIM }}>Loading…</div>
        ) : groups.length === 0 ? (
          <div className="text-[12px]" style={{ color: CREAM_DIM }}>Nothing pending. ✨</div>
        ) : (
          <div className="space-y-2">
            {groups.map(([k, items]) => {
              const first = items[0];
              const names = items.map((i) => i.attendee_name).filter(Boolean).join(", ");
              return (
                <div
                  key={k}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg"
                  style={{ border: `1px solid ${BORDER}`, backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] truncate" style={{ color: CREAM }}>
                      {first.value}{" "}
                      <span className="text-[11px]" style={{ color: CREAM_DIM }}>
                        × {items.length}
                      </span>
                    </div>
                    {names && (
                      <div className="text-[11px] truncate" style={{ color: CREAM_DIM }}>
                        from {names}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => approve(first)}
                      disabled={busyId === first.id}
                      className="hover:opacity-90"
                      style={{ backgroundColor: "#1D9E75", color: "#fff" }}
                    >
                      {busyId === first.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      <span className="ml-1 text-[11px]">Add</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => items.forEach(dismiss)}
                      className="hover:opacity-90"
                      style={{ color: CREAM_DIM }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {extraNiches.length > 0 && (
        <div>
          <div className="text-[11px] uppercase mb-2" style={{ letterSpacing: "0.1em", color: CREAM }}>
            Approved extras (live in the form)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {extraNiches.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => removeExtra(n)}
                className="text-[11px] px-2 py-0.5 rounded inline-flex items-center gap-1 hover:opacity-90"
                style={{ backgroundColor: "rgba(225,182,36,0.15)", color: "#FAC775", border: "1px solid rgba(225,182,36,0.4)" }}
                title="Click to remove"
              >
                {n}
                <X className="w-2.5 h-2.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AfterPartySuggestionsAdmin;
