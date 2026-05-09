import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { dashboardWishlist } from "@/lib/connect-session";
import { cn } from "@/lib/utils";

export type Filters = {
  visited?: boolean;
  sent_note?: boolean;
  role_flagged?: boolean;
  starred_brand?: boolean;
  has_connect_note?: boolean;
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
  relocation?: "yes" | "no" | undefined;
  outdoor?: "yes" | "no" | undefined;
  outdoor_min_years?: number;
  management?: "yes" | "no" | undefined;
  management_min_years?: number;
  areas?: string[];
  min_pay?: number;
};

const CAREER_STAGES = ["Student", "Early career", "Mid career", "Senior / Leadership"];
const POACHABLE = ["Actively looking", "Open to chats", "Not looking, but flattered"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const WORKPLACE = ["In office", "Hybrid", "Remote"];
const REMOTE = ["Yes", "No", "Hybrid"];
const FIELDS = ["Marketing", "Product", "Design", "Engineering", "Sales", "Operations", "Retail", "Other"];

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

function ChipGroup({ label, options, value = [], onChange }: { label: string; options: string[]; value?: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <div>
      <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => <Chip key={o} active={value.includes(o)} onClick={() => toggle(o)}>{o}</Chip>)}
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
      <div>
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, hook, pitch, or keyword..."
          className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
        />
      </div>

      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">
          Engagement with my brand
        </Label>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!!filters.visited} onClick={() => set({ visited: !filters.visited })}>
            Visited my table {!hasVisited && "(0 so far)"}
          </Chip>
          <Chip active={!!filters.sent_note} onClick={() => set({ sent_note: !filters.sent_note })}>Sent me a note</Chip>
          <Chip active={!!filters.role_flagged} onClick={() => set({ role_flagged: !filters.role_flagged })}>Flagged a role to apply to</Chip>
          <Chip active={!!filters.starred_brand} onClick={() => set({ starred_brand: !filters.starred_brand })}>Starred my brand</Chip>
          <Chip active={!!filters.pre_event_note} onClick={() => set({ pre_event_note: !filters.pre_event_note })}>Pre-event note</Chip>
          <Chip active={!!filters.during_event_note} onClick={() => set({ during_event_note: !filters.during_event_note })}>Note from event</Chip>
          <Chip active={!!filters.post_event_note} onClick={() => set({ post_event_note: !filters.post_event_note })}>Post-event note</Chip>
        </div>
      </div>

      <ChipGroup label="Career stage" options={CAREER_STAGES} value={filters.career_stage} onChange={(v) => set({ career_stage: v })} />
      <ChipGroup label="Poachable status" options={POACHABLE} value={filters.poachable_status} onChange={(v) => set({ poachable_status: v })} />

      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">Field</Label>
        <div className="flex flex-wrap gap-1.5">
          {FIELDS.map((f) => (
            <Chip key={f} active={filters.field === f} onClick={() => set({ field: filters.field === f ? undefined : f })}>{f}</Chip>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">
          Years in field: {yrsMin} to {yrsMax}+
        </Label>
        <Slider min={0} max={30} step={1} value={[yrsMin, yrsMax]} onValueChange={(v) => set({ years_min: v[0], years_max: v[1] })} />
      </div>

      <ChipGroup label="Job type seeking" options={JOB_TYPES} value={filters.job_types} onChange={(v) => set({ job_types: v })} />
      <ChipGroup label="Workplace preference" options={WORKPLACE} value={filters.workplace} onChange={(v) => set({ workplace: v })} />
      <ChipGroup label="Remote" options={REMOTE} value={filters.remote} onChange={(v) => set({ remote: v })} />

      <TriToggle label="Open to relocation" value={filters.relocation} onChange={(v) => set({ relocation: v })} />

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

      <div>
        <Label className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2 block">Min pay rate (annual $)</Label>
        <Input
          type="number" min={0} step={5000} placeholder="e.g. 60000"
          value={filters.min_pay ?? ""}
          onChange={(e) => set({ min_pay: e.target.value ? Number(e.target.value) : undefined })}
          className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
        />
      </div>

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
