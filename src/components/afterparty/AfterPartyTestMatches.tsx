import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play } from "lucide-react";

const SAMPLE = JSON.stringify(
  [
    {
      id: "a1", attendee_number: 1, full_name: "Maya Park", role: "creator",
      niches: ["fly fishing", "rivers"], creator_types: ["videographer"],
      platforms: ["instagram", "youtube"], looking_for: ["find a travel partner", "find brand deals"],
      brands_wishlist: "Patagonia, Yeti", photo_url: "x", mind_blowing_fact: "Caught a 30lb steelhead",
      audience_size: "10k-50k",
    },
    {
      id: "a2", attendee_number: 2, full_name: "Jordan Lee", role: "creator",
      niches: ["fly fishing"], creator_types: ["photographer"],
      looking_for: ["find a travel partner", "make friends in the industry"],
      photo_url: "x",
    },
    {
      id: "b1", attendee_number: 3, full_name: "Sam Patagonia", role: "brand",
      company: "Patagonia", brand_seeking: ["videographers", "photographers"],
      brand_fit_notes: "Looking for river storytellers", budget_range: "$5k-$15k",
    },
    {
      id: "b2", attendee_number: 4, full_name: "Alex Patagonia", role: "brand",
      company: "Patagonia", brand_seeking: ["videographers"],
    },
  ],
  null,
  2,
);

const AfterPartyTestMatches = () => {
  const { toast } = useToast();
  const [input, setInput] = useState(SAMPLE);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    let attendees: any[];
    try { attendees = JSON.parse(input); }
    catch (e: any) { toast({ title: "Bad JSON", description: e.message, variant: "destructive" }); return; }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("compute-afterparty-matches", {
      body: { attendees, topN: 5 },
    });
    setLoading(false);
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    setResult(data);
  };

  const runLive = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("compute-afterparty-matches", { body: {} });
    setLoading(false);
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    setResult(data);
  };

  return (
    <div className="rounded-xl border border-events-cream/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-events-cream">Test matching</h3>
          <p className="text-xs text-events-cream/50 mt-1">
            Paste fake attendees (JSON array) and see who matches who. Or run against live data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={runLive} disabled={loading} className="border-events-cream/30 text-events-cream">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run on live data"}
          </Button>
          <Button size="sm" onClick={run} disabled={loading} className="bg-events-yellow text-events-teal">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Run on JSON
          </Button>
        </div>
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        className="font-mono text-xs bg-events-cream/5 border-events-cream/10 text-events-cream"
      />

      {result && (
        <div className="space-y-2 max-h-96 overflow-auto">
          {(result.results || [{ ...result }]).map((r: any, i: number) => (
            <div key={i} className="rounded border border-events-cream/10 p-3 text-xs text-events-cream">
              <div className="font-bold text-events-yellow mb-1">
                #{r.number ?? r.me?.id} {r.name ?? r.me?.name} <span className="text-events-cream/50 font-normal">· {r.role ?? r.me?.role}{r.company || r.me?.company ? ` · ${r.company || r.me?.company}` : ""}</span>
              </div>
              {(r.matches || []).length === 0 && <div className="text-events-cream/40 italic">No matches</div>}
              {(r.matches || []).map((m: any) => (
                <div key={m.match_attendee_id} className="ml-3 py-0.5 flex items-baseline gap-2">
                  <span className="text-events-coral font-bold w-8">#{m.match_number}</span>
                  <span className="flex-1">{m.match_name} <span className="text-events-cream/40">{m.match_company ? `· ${m.match_company}` : ""}</span></span>
                  <span className="text-events-yellow">{m.score}pts</span>
                  <span className="text-events-cream/60 italic max-w-[40%] truncate">{m.reasons?.[0] || ""}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AfterPartyTestMatches;
