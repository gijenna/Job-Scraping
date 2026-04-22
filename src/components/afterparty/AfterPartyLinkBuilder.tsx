import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, Loader2, Link2 } from "lucide-react";

interface ParsedRow {
  full_name: string;
  email?: string;
  role: "creator" | "brand";
  company?: string;
}

interface ResultRow extends ParsedRow {
  slug: string;
  link: string;
  status: "created" | "existing" | "error";
  note?: string;
}

const PUBLISHED_BASE = "https://basecampoutdoorevents.com";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") {
        if (cur || row.length) { row.push(cur); rows.push(row); row = []; cur = ""; }
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else cur += c;
    }
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

const csvEscape = (v: string) => {
  if (v == null) return "";
  const s = String(v);
  return /[\",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const downloadCsv = (filename: string, rows: ResultRow[]) => {
  const header = ["name", "email", "role", "company", "slug", "personalized_link", "status", "note"];
  const lines = [header.join(",")];
  rows.forEach((r) => {
    lines.push([
      csvEscape(r.full_name),
      csvEscape(r.email || ""),
      csvEscape(r.role),
      csvEscape(r.company || ""),
      csvEscape(r.slug),
      csvEscape(r.link),
      csvEscape(r.status),
      csvEscape(r.note || ""),
    ].join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const AfterPartyLinkBuilder = ({ onCreated }: { onCreated: () => void }) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [working, setWorking] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsv(text);
    if (!parsed.length) {
      toast({ title: "Empty CSV", variant: "destructive" });
      return;
    }
    const header = parsed[0].map((h) => h.toLowerCase().trim());
    const hasHeader = ["name", "full_name", "email", "role"].some((k) => header.includes(k));
    const dataRows = hasHeader ? parsed.slice(1) : parsed;

    const idxName = Math.max(header.indexOf("name"), header.indexOf("full_name"));
    const idxEmail = header.indexOf("email");
    const idxRole = header.indexOf("role");
    const idxCompany = header.indexOf("company");

    const out: ParsedRow[] = dataRows
      .map((r) => ({
        full_name: (idxName >= 0 ? r[idxName] : r[0])?.trim() || "",
        email: (idxEmail >= 0 ? r[idxEmail] : r[1])?.trim() || undefined,
        role: ((idxRole >= 0 ? r[idxRole] : r[2])?.trim().toLowerCase() === "brand" ? "brand" : "creator") as "creator" | "brand",
        company: (idxCompany >= 0 ? r[idxCompany] : r[3])?.trim() || undefined,
      }))
      .filter((r) => r.full_name);
    setRows(out);
    setResults([]);
    e.target.value = "";
  };

  const generate = async () => {
    if (!rows.length) return;
    setWorking(true);
    const out: ResultRow[] = [];

    const { data: existing } = await (supabase as any)
      .from("afterparty_attendees")
      .select("slug, full_name");
    const existingSlugs = new Set<string>((existing || []).map((e: any) => e.slug));

    for (const r of rows) {
      let baseSlug = slugify(r.full_name);
      if (!baseSlug) baseSlug = `guest-${Math.random().toString(36).slice(2, 7)}`;
      let slug = baseSlug;
      let n = 2;

      const dupe = (existing || []).find((e: any) => e.slug === baseSlug);
      if (dupe) {
        out.push({
          ...r,
          slug: baseSlug,
          link: `${PUBLISHED_BASE}/afterparty/${baseSlug}`,
          status: "existing",
          note: "Slug already existed — reusing link",
        });
        continue;
      }

      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${n++}`;
      }

      const { error } = await (supabase as any).from("afterparty_attendees").insert({
        full_name: r.full_name,
        email: r.email || null,
        role: r.role,
        company: r.company || null,
        slug,
        status: "invited",
      });

      if (error) {
        out.push({
          ...r,
          slug,
          link: "",
          status: "error",
          note: error.message,
        });
      } else {
        existingSlugs.add(slug);
        out.push({
          ...r,
          slug,
          link: `${PUBLISHED_BASE}/afterparty/${slug}`,
          status: "created",
        });
      }
    }

    setResults(out);
    setWorking(false);
    const created = out.filter((o) => o.status === "created").length;
    const existed = out.filter((o) => o.status === "existing").length;
    const errored = out.filter((o) => o.status === "error").length;
    toast({
      title: "Links generated",
      description: `Created: ${created} · Existing: ${existed}${errored ? ` · Errors: ${errored}` : ""}`,
    });
    onCreated();
  };

  const download = () => {
    if (!results.length) return;
    downloadCsv(`afterparty-links-${new Date().toISOString().slice(0, 10)}.csv`, results);
  };

  return (
    <div className="rounded-xl border border-events-cream/10 p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-display font-bold text-events-cream flex items-center gap-2">
            <Link2 className="w-4 h-4 text-events-yellow" />
            Generate personalized invite links
          </h3>
          <p className="text-xs text-events-cream/50 mt-1">
            Upload a CSV with <code>name, email, role, company</code>. We'll create attendees and give you a CSV back with each person's personalized link.
          </p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
            <span className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-events-cream/10 text-events-cream hover:bg-events-cream/20">
              <Upload className="w-4 h-4 mr-2" /> Choose CSV
            </span>
          </label>
          {rows.length > 0 && (
            <Button
              onClick={generate}
              disabled={working}
              className="bg-events-coral text-events-cream"
            >
              {working ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
              Generate {rows.length} links
            </Button>
          )}
          {results.length > 0 && (
            <Button
              onClick={download}
              variant="outline"
              className="border-events-cream/30 text-events-cream"
            >
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          )}
        </div>
      </div>

      {(results.length > 0 || rows.length > 0) && (
        <div className="max-h-64 overflow-auto rounded border border-events-cream/10">
          <table className="w-full text-xs text-events-cream">
            <thead className="bg-events-cream/5 sticky top-0">
              <tr>
                <th className="text-left px-2 py-1">Name</th>
                <th className="text-left px-2 py-1">Email</th>
                <th className="text-left px-2 py-1">Role</th>
                <th className="text-left px-2 py-1">Personalized link</th>
                <th className="text-left px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {(results.length ? results : rows.map((r) => ({ ...r, slug: "", link: "", status: "—" as any }))).map((r: any, i) => (
                <tr key={i} className="border-t border-events-cream/10">
                  <td className="px-2 py-1">{r.full_name}</td>
                  <td className="px-2 py-1 text-events-cream/60">{r.email || "—"}</td>
                  <td className="px-2 py-1 capitalize text-events-cream/70">{r.role}</td>
                  <td className="px-2 py-1 text-events-yellow truncate max-w-[280px]">{r.link || "—"}</td>
                  <td className="px-2 py-1 text-events-cream/70">{r.status}{r.note ? ` · ${r.note}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AfterPartyLinkBuilder;
