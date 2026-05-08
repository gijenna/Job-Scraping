// Reusable bubble logo selector. Wraps the inline pattern previously embedded
// in ExpertIntakeForm.tsx ("Previously worked at"). Used for the candidate
// profile's `dream_companies` field and the expert form's previous companies.
//
// Props:
//   value:    string[]  list of company names
//   domains:  Record<string,string>  per-company URL/domain override
//   onChange: (value, domains) => void
//   suggestionEventSlug?: string   pre-populates suggestions from event_map_brands
//
// Logo loading reuses the existing Google Favicon helper. If the logo fails to
// load, the chip falls back to text only.

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { faviconFromUrl } from "@/lib/url-logo";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  value: string[];
  domains: Record<string, string>;
  onChange: (value: string[], domains: Record<string, string>) => void;
  suggestionEventSlug?: string;
  placeholder?: string;
  allowOverride?: boolean;
}

const logoFor = (company: string, domains: Record<string, string>) => {
  const dom = domains[company];
  if (dom) return faviconFromUrl(dom, 128);
  return faviconFromUrl(`${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`, 128);
};

const BubbleLogoPicker = ({
  value, domains, onChange, suggestionEventSlug, placeholder = "Type a company...", allowOverride = true,
}: Props) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [eventBrands, setEventBrands] = useState<{ name: string; website_url: string | null }[]>([]);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!suggestionEventSlug) return;
    supabase
      .from("event_map_brands")
      .select("name, website_url")
      .eq("event_slug", suggestionEventSlug)
      .then(({ data }) => setEventBrands((data as any) || []));
  }, [suggestionEventSlug]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    const taken = new Set(value.map((v) => v.toLowerCase()));
    const event = eventBrands
      .filter((b) => !taken.has(b.name.toLowerCase()) && (!q || b.name.toLowerCase().includes(q)))
      .slice(0, 8)
      .map((b) => ({ name: b.name, website_url: b.website_url, source: "event" as const }));
    return event;
  }, [input, eventBrands, value]);

  const commit = (raw: string, websiteUrl?: string | null) => {
    const name = raw.trim();
    if (!name) return;
    if (value.some((v) => v.toLowerCase() === name.toLowerCase())) {
      setInput(""); return;
    }
    const newDomains = { ...domains };
    // If the input looks like a URL, use it as the domain override.
    const looksLikeUrl = /\.[a-z]{2,}/i.test(name) && !name.includes(" ");
    if (looksLikeUrl) {
      const cleanName = name.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
      newDomains[cleanName] = name;
      onChange([...value, cleanName], newDomains);
    } else {
      if (websiteUrl) newDomains[name] = websiteUrl;
      onChange([...value, name], newDomains);
    }
    setInput(""); setOpen(false);
  };

  const remove = (name: string) => {
    const newDomains = { ...domains };
    delete newDomains[name];
    onChange(value.filter((v) => v !== name), newDomains);
  };

  const setOverride = (name: string, dom: string) => {
    const newDomains = { ...domains, [name]: dom };
    if (!dom) delete newDomains[name];
    onChange(value, newDomains);
  };

  return (
    <div ref={wrapRef} className="space-y-2">
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commit(input); }
            if (e.key === "Backspace" && !input && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          placeholder={placeholder}
          className="bg-events-cream/5 border-events-cream/20 text-events-cream"
        />
        {open && (suggestions.length > 0 || input.trim()) && (
          <div className="absolute z-20 mt-1 w-full bg-events-teal border border-events-cream/20 rounded-md shadow-lg max-h-64 overflow-y-auto">
            {suggestions.length > 0 && (
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-events-cream/40 font-body">At this event</div>
            )}
            {suggestions.map((s) => (
              <button
                key={s.name}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); commit(s.name, s.website_url); }}
                className="w-full text-left px-3 py-2 text-sm font-body text-events-cream hover:bg-events-cream/10 flex items-center gap-2"
              >
                <img
                  src={logoFor(s.name, s.website_url ? { [s.name]: s.website_url } : {}) || ""}
                  alt=""
                  className="w-5 h-5 rounded-full bg-white object-contain"
                  onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
                />
                {s.name}
              </button>
            ))}
            {input.trim() && !suggestions.find((s) => s.name.toLowerCase() === input.trim().toLowerCase()) && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); commit(input); }}
                className="w-full text-left px-3 py-2 text-sm font-body text-events-coral hover:bg-events-cream/10"
              >
                Add &quot;{input.trim()}&quot;
              </button>
            )}
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((company) => {
            const src = logoFor(company, domains);
            const editing = editingDomain === company;
            return (
              <div key={company} className="group relative">
                <div className="flex items-center gap-1.5 bg-events-cream/10 border border-events-cream/15 rounded-full pl-1 pr-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center">
                    {src ? (
                      <img
                        src={src}
                        alt=""
                        className="w-5 h-5 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : null}
                  </div>
                  <span className="text-xs font-body text-events-cream max-w-[120px] truncate">{company}</span>
                  {allowOverride && (
                    <button
                      type="button"
                      onClick={() => setEditingDomain(editing ? null : company)}
                      className="text-[10px] text-events-cream/40 hover:text-events-cream/80"
                      title="Edit logo source"
                    >
                      ⚙
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(company)}
                    className="text-events-cream/50 hover:text-events-coral"
                    aria-label={`Remove ${company}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {editing && (
                  <div className="absolute z-10 left-0 mt-1 bg-events-teal border border-events-cream/20 rounded-md p-2 shadow-lg w-64">
                    <Input
                      value={domains[company] || ""}
                      onChange={(e) => setOverride(company, e.target.value)}
                      placeholder={`${company.toLowerCase().replace(/\s/g, "")}.com`}
                      className="bg-events-cream/5 border-events-cream/20 text-events-cream text-xs h-8"
                    />
                    <p className="text-[10px] text-events-cream/40 mt-1 font-body">Paste a URL if the logo doesn't load.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BubbleLogoPicker;
