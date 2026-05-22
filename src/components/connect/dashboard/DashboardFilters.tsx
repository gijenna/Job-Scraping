import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { dashboardWishlist } from "@/lib/connect-session";
import { cn } from "@/lib/utils";
import {
  FIELDS as ALL_FIELDS,
  JOB_TYPES as TAX_JOB_TYPES,
  WORKPLACE_TYPES as TAX_WORKPLACE,
  REMOTE_PREFERENCES as TAX_REMOTE,
  NICHES as TAX_NICHES,
  POACHABLE_STATUS as TAX_POACHABLE,
  US_STATES,
} from "@/lib/taxonomies";

export type Filters = {
  visited?: boolean;
  role_flagged?: boolean;
  starred_brand?: boolean;
  pre_event_note?: boolean;
  during_event_note?: boolean;
  post_event_note?: boolean;
  career_stage?: string[];
  poachable_status?: string[];
  field?: string;
  years_min?: number;
  years_max?: number;
  job_types?: string[];
  workplace?: string[];
  remote?: string[];
  niches?: string[];
  areas?: string[];
  states?: string[];
  city?: string;
  open_to_retail?: boolean;
  outdoor?: "yes" | "no" | undefined;
  outdoor_min_years?: number;
  management?: "yes" | "no" | undefined;
  management_min_years?: number;
  min_pay?: number;
};

// Career stage chips: short label → stored value in candidates.career_stage
export const CAREER_STAGE_CHIPS: { label: string; value: string }[] = [
  { label: "In the industry", value: "I currently work in the outdoor industry" },
  { label: "Transitioning in", value: "I'm mid-career, looking to transition into the outdoor industry" },
  { label: "Student or entry-level", value: "I'm a student or entry-level" },
  { label: "Just exploring", value: "Unsure, just here to explore the outdoor industry" },
];

export function Chip({ active, onClick, children }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-body border transition-colors",
        active
          ? "bg-events-coral text-events-cream border-events-coral"
          : "bg-events-cream/5 text-events-cream/80 border-events-cream/15 hover:border-events-cream/40",
      )}
    >
      {children}
    </button>
  );
}

function ChipGroup({
  label, options, value = [], onChange,
}: {
  label: string;
  options: { label: string; value: string }[] | readonly string[];
  value?: string[];
  onChange: (v: string[]) => void;
}) {
  const norm = useMemo(
    () => (options as any[]).map((o) => (typeof o === "string" ? { label: o, value: o } : o)),
    [options],
  );
  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };
  return (
    <div>
      <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {norm.map((o) => (
          <Chip key={o.value} active={value.includes(o.value)} onClick={() => toggle(o.value)}>{o.label}</Chip>
        ))}
      </div>
    </div>
  );
}

function TriToggle({ label, value, onChange }: { label: string; value?: "yes" | "no"; onChange: (v: "yes" | "no" | undefined) => void }) {
  return (
    <div>
      <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">{label}</Label>
      <div className="flex gap-1.5">
        <Chip active={value === "yes"} onClick={() => onChange(value === "yes" ? undefined : "yes")}>Yes</Chip>
        <Chip active={value === "no"} onClick={() => onChange(value === "no" ? undefined : "no")}>No</Chip>
      </div>
    </div>
  );
}

function NicheSearchableMulti({ value = [], onChange }: { value?: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return TAX_NICHES.filter((n) => !ql || n.toLowerCase().includes(ql));
  }, [q]);
  const toggle = (n: string) => onChange(value.includes(n) ? value.filter((x) => x !== n) : [...value, n]);
  return (
    <div>
      <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">Niches</Label>
      <Input
        value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search niches..."
        className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40 mb-2 h-8 text-xs"
      />
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
        {filtered.map((n) => (
          <Chip key={n} active={value.includes(n)} onClick={() => toggle(n)}>{n}</Chip>
        ))}
      </div>
    </div>
  );
}

function StateMultiSelect({ value = [], onChange }: { value?: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return US_STATES.filter((s) => !ql || s.toLowerCase().includes(ql));
  }, [q]);
  const toggle = (s: string) => onChange(value.includes(s) ? value.filter((x) => x !== s) : [...value, s]);
  return (
    <div>
      <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">State</Label>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((s) => (
            <Chip key={s} active onClick={() => toggle(s)}>{s} ✕</Chip>
          ))}
        </div>
      )}
      <Input
        value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search states..."
        className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40 mb-2 h-8 text-xs"
      />
      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
        {filtered.map((s) => (
          <Chip key={s} active={value.includes(s)} onClick={() => toggle(s)}>{s}</Chip>
        ))}
      </div>
    </div>
  );
}

export default function DashboardFilters({
  filters, onChange, search, onSearch, hasVisited,
}: {
  filters: Filters; onChange: (f: Filters) => void;
  search: string; onSearch: (s: string) => void; hasVisited: boolean;
}) {
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState("");
  const [sending, setSending] = useState(false);
  const yrsMin = filters.years_min ?? 0;
  const yrsMax = filters.years_max ?? 30;

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const clearAll = () => {
    onChange({});
    onSearch("");
  };

  const sendWishlist = async () => {
    if (!wishlist.trim()) return;
    setSending(true);
    try {
      await dashboardWishlist(wishlist);
      setWishlist("");
      toast({ title: "Thanks", description: "We're using this to make search smarter." });
    } catch (e: any) {
      toast({ title: "Failed to send", description: e.message, variant: "destructive" });
    }
    setSending(false);
  };

  return (
    <div className="space-y-5 text-events-cream">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={clearAll}
          className="text-events-cream/70 hover:text-events-cream underline-offset-4 hover:underline text-xs font-body"
        >
          Clear all filters
        </button>
      </div>

      <div>
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, hook, pitch, or keyword..."
          className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
        />
      </div>

      {/* 1. Engagement — split into pre-event (available now) and in-event (locked until go-live) */}
      {(() => {
        const GO_LIVE = new Date("2026-05-28T20:30:00Z"); // May 28, 2026 · 2:30 PM MT
        const isLive = new Date() >= GO_LIVE;
        const lockedLabel = "Unlocks May 28 · 2:30 PM MT";
        const LockedChip = ({ children }: { children: React.ReactNode }) => (
          <span
            title={lockedLabel}
            className="px-3 py-1.5 rounded-full text-xs font-body border border-dashed border-events-cream/15 bg-events-cream/[0.03] text-events-cream/35 cursor-not-allowed inline-flex items-center gap-1.5"
          >
            <span aria-hidden>🔒</span>{children}
          </span>
        );
        return (
          <>
            <div>
              <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">
                Pre-event engagement with my brand
              </Label>
              <div className="flex flex-wrap gap-1.5">
                <Chip active={!!filters.starred_brand} onClick={() => set({ starred_brand: !filters.starred_brand })}>Starred my brand pre-event</Chip>
                <Chip active={!!filters.pre_event_note} onClick={() => set({ pre_event_note: !filters.pre_event_note })}>Pre-event note</Chip>
              </div>
            </div>

            <div>
              <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-1 block">
                In-event engagement with my brand
              </Label>
              {!isLive && (
                <p className="text-[11px] text-events-cream/50 font-body mb-2 italic">
                  Unlocks live on May 28 at 2:30 PM MT.
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {isLive ? (
                  <>
                    <Chip active={!!filters.visited} onClick={() => set({ visited: !filters.visited })}>
                      Visited my table {!hasVisited && "(0 so far)"}
                    </Chip>
                    <Chip active={!!filters.role_flagged} onClick={() => set({ role_flagged: !filters.role_flagged })}>Flagged for role by team</Chip>
                    <Chip active={!!filters.during_event_note} onClick={() => set({ during_event_note: !filters.during_event_note })}>Note from event</Chip>
                    <Chip active={!!filters.post_event_note} onClick={() => set({ post_event_note: !filters.post_event_note })}>Post-event note</Chip>
                  </>
                ) : (
                  <>
                    <LockedChip>Visited my table</LockedChip>
                    <LockedChip>Flagged for role by team</LockedChip>
                    <LockedChip>Note from event</LockedChip>
                    <LockedChip>Post-event note</LockedChip>
                  </>
                )}
              </div>
            </div>
          </>
        );
      })()}


      {/* 2. Open to retail */}
      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">Retail</Label>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!!filters.open_to_retail} onClick={() => set({ open_to_retail: !filters.open_to_retail })}>Open to retail work</Chip>
        </div>
      </div>

      {/* 3. Poachable status */}
      <ChipGroup
        label="How easily could a brand poach you?"
        options={TAX_POACHABLE as any}
        value={filters.poachable_status}
        onChange={(v) => set({ poachable_status: v })}
      />

      {/* 4. Field + Focus */}
      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">Field</Label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_FIELDS.map((f) => (
            <Chip key={f} active={filters.field === f} onClick={() => set({ field: filters.field === f ? undefined : f })}>{f}</Chip>
          ))}
        </div>
      </div>

      {/* 5. Years in field */}
      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">
          Years in field: {yrsMin} to {yrsMax}+
        </Label>
        <Slider min={0} max={30} step={1} value={[yrsMin, yrsMax]} onValueChange={(v) => set({ years_min: v[0], years_max: v[1] })} />
      </div>

      {/* 6. Location */}
      <div className="space-y-3 pt-1">
        <StateMultiSelect value={filters.states} onChange={(v) => set({ states: v })} />
        <div>
          <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">City</Label>
          <Input
            value={filters.city || ""}
            onChange={(e) => set({ city: e.target.value })}
            placeholder="e.g. Denver"
            className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
          />
          <p className="text-[11px] text-events-cream/50 mt-1 font-body">
            Also matches candidates open to relocating to that city or anywhere.
          </p>
        </div>
      </div>

      {/* 7. Remote preference */}
      <ChipGroup label="Remote preference" options={TAX_REMOTE as any} value={filters.remote} onChange={(v) => set({ remote: v })} />

      {/* 8. Min pay rate */}
      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">Min pay rate (annual $)</Label>
        <Input
          type="number" min={0} step={5000} placeholder="e.g. 60000"
          value={filters.min_pay ?? ""}
          onChange={(e) => set({ min_pay: e.target.value ? Number(e.target.value) : undefined })}
          className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
        />
      </div>

      {/* 9. Niches */}
      <NicheSearchableMulti value={filters.niches} onChange={(v) => set({ niches: v })} />

      {/* 10. Skills (renamed from Areas of expertise) */}
      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">Skills</Label>
        <Input
          placeholder="Filter by skill keyword..."
          value={filters.areas?.[0] || ""}
          onChange={(e) => set({ areas: e.target.value ? [e.target.value] : undefined })}
          className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
        />
      </div>

      {/* 11. Outdoor industry */}
      <div className="space-y-2">
        <TriToggle label="Outdoor industry experience" value={filters.outdoor} onChange={(v) => set({ outdoor: v })} />
        {filters.outdoor === "yes" && (
          <Input
            type="number" min={0} placeholder="Min years"
            value={filters.outdoor_min_years ?? ""}
            onChange={(e) => set({ outdoor_min_years: e.target.value ? Number(e.target.value) : undefined })}
            className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
          />
        )}
      </div>

      {/* 12. Job type seeking */}
      <ChipGroup label="Job type seeking" options={TAX_JOB_TYPES as any} value={filters.job_types} onChange={(v) => set({ job_types: v })} />

      {/* 13. Career stage */}
      <ChipGroup
        label="Career stage"
        options={CAREER_STAGE_CHIPS}
        value={filters.career_stage}
        onChange={(v) => set({ career_stage: v })}
      />

      {/* 14. Management experience */}
      <div className="space-y-2">
        <TriToggle label="Management experience" value={filters.management} onChange={(v) => set({ management: v })} />
        {filters.management === "yes" && (
          <Input
            type="number" min={0} placeholder="Min years"
            value={filters.management_min_years ?? ""}
            onChange={(e) => set({ management_min_years: e.target.value ? Number(e.target.value) : undefined })}
            className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
          />
        )}
      </div>

      {/* 15. Workplace type preference */}
      <ChipGroup label="Workplace type preference" options={TAX_WORKPLACE as any} value={filters.workplace} onChange={(v) => set({ workplace: v })} />

      <div className="pt-4 border-t border-events-cream/10 opacity-80">
        <Label className="text-events-cream/70 text-xs font-body block mb-1">Can't find what you're looking for?</Label>
        <p className="text-events-cream/50 text-[11px] font-body mb-2">
          Tell us what you'd search for if you could just ask in plain English. We're using this to build smarter search.
        </p>
        <Textarea
          value={wishlist} onChange={(e) => setWishlist(e.target.value)}
          rows={2} placeholder="e.g. people who used to work at REI but live in Denver"
          className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40 text-sm"
        />
        <Button onClick={sendWishlist} disabled={sending || !wishlist.trim()} size="sm" className="mt-2 bg-events-coral hover:bg-events-coral/90 text-events-cream">
          Send
        </Button>
      </div>
    </div>
  );
}
