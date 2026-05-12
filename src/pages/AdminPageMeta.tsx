import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// All slugs that have share-preview metadata served by og-meta or usePageMeta
const PAGES: Array<{ slug: string; label: string; urls: string[] }> = [
  { slug: "outsidedays26", label: "Outside Days 2026 (Denver)", urls: ["/outsidedays26", "/OutsideDays26"] },
  { slug: "outsidedays26-cos", label: "Outside Days COS", urls: ["/OutsideDaysCOS"] },
  { slug: "pnw26", label: "Outside Days PNW 2026", urls: ["/pnw26", "/PNW26"] },
  { slug: "denverreps", label: "Denver Brand Reps", urls: ["/denverreps", "/denverreps/:name"] },
  { slug: "pnwreps", label: "PNW Brand Reps", urls: ["/pnwreps", "/pnwreps/:name"] },
  { slug: "afterparty", label: "After Party (Oakley RiNo)", urls: ["/afterparty", "/afterpartyoakley", "/afterparty/:name", "/guests"] },
  { slug: "events", label: "Events Hub", urls: ["/events"] },
  { slug: "gather-denver", label: "Gather Denver (legacy)", urls: ["/gather-denver"] },
  { slug: "gather-pnw", label: "Gather PNW (legacy)", urls: ["/gather-pnw"] },
];

const FIELDS = [
  { key: "page_og_title", label: "Title" },
  { key: "page_og_description", label: "Description" },
  { key: "page_og_image", label: "Preview Image", isImage: true },
  { key: "page_favicon", label: "Favicon", isImage: true },
] as const;

type SettingsMap = Record<string, Record<string, string>>; // slug -> key -> value

const AdminPageMeta = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SettingsMap>({});
  const [drafts, setDrafts] = useState<SettingsMap>({});

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!isAdminUser(user)) {
        if (user) await supabase.auth.signOut();
        navigate("/admin");
        return;
      }
      setAuthed(true);
      await fetchAll();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const slugs = PAGES.map((p) => p.slug);
    const { data: rows } = await supabase
      .from("event_settings" as any)
      .select("event_slug, setting_key, setting_value")
      .in("event_slug", slugs)
      .in("setting_key", FIELDS.map((f) => f.key));
    const map: SettingsMap = {};
    (rows as any[])?.forEach((r) => {
      map[r.event_slug] = map[r.event_slug] || {};
      map[r.event_slug][r.setting_key] = r.setting_value;
    });
    setData(map);
    setDrafts(JSON.parse(JSON.stringify(map)));
    setLoading(false);
  };

  const setDraft = (slug: string, key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [slug]: { ...(prev[slug] || {}), [key]: value } }));
  };

  const saveField = async (slug: string, key: string) => {
    const value = (drafts[slug]?.[key] || "").trim();
    if (value === (data[slug]?.[key] || "")) return;
    const { error } = await (supabase as any)
      .from("event_settings")
      .upsert(
        { event_slug: slug, setting_key: key, setting_value: value },
        { onConflict: "event_slug,setting_key" }
      );
    if (error) {
      toast.error(`Save failed: ${error.message}`);
      return;
    }
    setData((prev) => ({ ...prev, [slug]: { ...(prev[slug] || {}), [key]: value } }));
    toast.success("Saved");
  };

  const uploadImage = async (slug: string, key: string, file: File) => {
    const ext = file.name.split(".").pop() || "png";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("page-meta").upload(path, file);
    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("page-meta").getPublicUrl(path);
    setDraft(slug, key, publicUrl);
    await (supabase as any)
      .from("event_settings")
      .upsert(
        { event_slug: slug, setting_key: key, setting_value: publicUrl },
        { onConflict: "event_slug,setting_key" }
      );
    setData((prev) => ({ ...prev, [slug]: { ...(prev[slug] || {}), [key]: publicUrl } }));
    toast.success("Uploaded");
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-events-teal text-events-cream">
      <div className="border-b border-events-cream/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/experts")} className="text-events-cream/60 hover:text-events-cream">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="font-display text-2xl font-bold">
              Page <span className="text-events-coral">Share Previews</span>
            </h1>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchAll} className="text-events-cream/60">Refresh</Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <p className="text-events-cream/70 text-sm">
          One row per page. The title, description, and image shown here are what crawlers (LinkedIn, iMessage, Slack, Facebook) display when someone shares the URL. Changes save on blur. Social platforms cache previews — use their debugger to force a refresh.
        </p>

        {loading ? (
          <p className="text-events-cream/40 text-center py-12">Loading...</p>
        ) : (
          <div className="space-y-4">
            {PAGES.map((p) => {
              const cur = drafts[p.slug] || {};
              return (
                <div key={p.slug} className="bg-events-card border border-events-cream/10 rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="font-display text-lg font-bold text-events-cream">{p.label}</h2>
                      <p className="text-events-cream/40 text-xs mt-0.5">slug: <code className="text-events-coral">{p.slug}</code></p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.urls.map((u) => (
                          <a key={u} href={u.includes(":") ? "#" : u} target="_blank" rel="noreferrer"
                             className="text-xs text-events-cream/60 hover:text-events-cream inline-flex items-center gap-1 bg-events-cream/5 px-2 py-1 rounded">
                            {u} {!u.includes(":") && <ExternalLink className="w-3 h-3" />}
                          </a>
                        ))}
                      </div>
                    </div>
                    {cur.page_og_image && (
                      <img src={cur.page_og_image} alt="" className="w-40 h-20 object-cover rounded border border-events-cream/10" />
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {FIELDS.map((f) => (
                      <div key={f.key} className={f.key === "page_og_description" ? "md:col-span-2" : ""}>
                        <label className="text-xs text-events-cream/50 uppercase tracking-wide">{f.label}</label>
                        <div className="flex gap-2 mt-1">
                          {f.key === "page_og_description" ? (
                            <textarea
                              value={cur[f.key] || ""}
                              onChange={(e) => setDraft(p.slug, f.key, e.target.value)}
                              onBlur={() => saveField(p.slug, f.key)}
                              rows={2}
                              className="flex-1 bg-events-teal border border-events-cream/10 rounded px-3 py-2 text-sm text-events-cream focus:outline-none focus:border-events-coral"
                            />
                          ) : (
                            <input
                              value={cur[f.key] || ""}
                              onChange={(e) => setDraft(p.slug, f.key, e.target.value)}
                              onBlur={() => saveField(p.slug, f.key)}
                              placeholder={f.isImage ? "https://..." : ""}
                              className="flex-1 bg-events-teal border border-events-cream/10 rounded px-3 py-2 text-sm text-events-cream focus:outline-none focus:border-events-coral"
                            />
                          )}
                          {f.isImage && (
                            <label className="shrink-0 w-9 h-9 rounded bg-events-teal border border-events-cream/10 flex items-center justify-center cursor-pointer hover:border-events-coral" title="Upload">
                              <Upload className="w-4 h-4 text-events-cream/60" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) uploadImage(p.slug, f.key, file);
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageMeta;
