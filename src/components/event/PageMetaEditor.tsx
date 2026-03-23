import { useState } from "react";
import { Image, Globe, FileText, Upload, X, Settings2 } from "lucide-react";
import { useEditableTextContext } from "@/components/EditableTextProvider";
import { supabase } from "@/integrations/supabase/client";

const FIELDS = [
  { key: "page_og_title", label: "Page Title", icon: FileText, placeholder: "My Event Page" },
  { key: "page_og_description", label: "OG Description", icon: FileText, placeholder: "A short description for social previews" },
  { key: "page_og_image", label: "OG / Preview Image URL", icon: Image, placeholder: "https://..." },
  { key: "page_favicon", label: "Favicon URL", icon: Globe, placeholder: "https://..." },
] as const;

const PageMetaEditor = () => {
  const { isAdmin, settings, setSetting } = useEditableTextContext();
  const [open, setOpen] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  if (!isAdmin) return null;

  const handleOpen = () => {
    const initial: Record<string, string> = {};
    FIELDS.forEach((f) => { initial[f.key] = settings[f.key] || ""; });
    setDrafts(initial);
    setOpen(true);
  };

  const handleSave = async (key: string) => {
    const val = drafts[key]?.trim();
    if (val !== undefined) {
      await setSetting(key, val);
    }
  };

  const handleUpload = async (key: string, file: File) => {
    setUploading(key);
    const ext = file.name.split(".").pop() || "png";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("page-meta").upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("page-meta").getPublicUrl(path);
      setDrafts((p) => ({ ...p, [key]: publicUrl }));
      await setSetting(key, publicUrl);
    }
    setUploading(null);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-[60] w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="Page Meta / SEO"
      >
        <Settings2 className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-card text-card-foreground rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Page Meta & Preview</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {FIELDS.map((field) => {
              const Icon = field.icon;
              const isImage = field.key === "page_og_image" || field.key === "page_favicon";
              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Icon className="w-3.5 h-3.5" /> {field.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={drafts[field.key] || ""}
                      onChange={(e) => setDrafts((p) => ({ ...p, [field.key]: e.target.value }))}
                      onBlur={() => handleSave(field.key)}
                      placeholder={field.placeholder}
                      className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {isImage && (
                      <label className="shrink-0 w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center cursor-pointer hover:bg-accent transition-colors" title="Upload image">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUpload(field.key, f);
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {isImage && drafts[field.key] && (
                    <img src={drafts[field.key]} alt="Preview" className="h-12 w-auto rounded border border-border mt-1 object-contain" />
                  )}
                  {uploading === field.key && <p className="text-xs text-muted-foreground">Uploading...</p>}
                </div>
              );
            })}

            <p className="text-xs text-muted-foreground">
              Changes apply instantly. OG previews may take time to refresh on social platforms.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PageMetaEditor;
