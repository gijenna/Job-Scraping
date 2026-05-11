import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Template = {
  template_key: string;
  subject: string;
  preview_text: string | null;
  body: string;
};

export default function AdminEmailTemplates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!isAdminUser(user)) {
        if (user) await supabase.auth.signOut();
        navigate("/admin");
        return;
      }
      setAuthed(true);
      const { data, error } = await (supabase as any)
        .from("email_templates")
        .select("template_key, subject, preview_text, body")
        .order("template_key");
      if (error) {
        toast({ title: "Failed to load templates", description: error.message, variant: "destructive" });
        return;
      }
      setTemplates(data || []);
      if (data && data.length > 0) {
        setActiveKey(data[0].template_key);
        setDraft(data[0]);
      }
    })();
  }, [navigate, toast]);

  const selectTemplate = (key: string) => {
    const t = templates.find((x) => x.template_key === key);
    if (!t) return;
    setActiveKey(key);
    setDraft(t);
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    const { error } = await (supabase as any)
      .from("email_templates")
      .update({
        subject: draft.subject,
        preview_text: draft.preview_text,
        body: draft.body,
      })
      .eq("template_key", draft.template_key);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setTemplates((prev) => prev.map((t) => (t.template_key === draft.template_key ? draft : t)));
    toast({ title: "Saved", description: `${draft.template_key} updated.` });
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-events-teal">
      <div className="border-b border-events-cream/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/connect")} className="text-events-cream/60 hover:text-events-cream">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-2xl font-bold text-events-cream">
            Email <span className="text-events-coral">Templates</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-1">
          {templates.map((t) => (
            <button
              key={t.template_key}
              onClick={() => selectTemplate(t.template_key)}
              className={`w-full text-left px-3 py-2 rounded-md font-body text-sm transition-colors ${
                activeKey === t.template_key
                  ? "bg-events-coral text-events-cream"
                  : "text-events-cream/70 hover:bg-events-cream/5"
              }`}
            >
              {t.template_key}
            </button>
          ))}
        </aside>

        {draft && (
          <div className="space-y-4 bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5">
            <div>
              <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">
                Template key
              </Label>
              <p className="text-events-cream font-mono text-sm">{draft.template_key}</p>
            </div>
            <div>
              <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">
                Subject
              </Label>
              <Input
                value={draft.subject}
                onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">
                Preview text
              </Label>
              <Input
                value={draft.preview_text || ""}
                onChange={(e) => setDraft({ ...draft, preview_text: e.target.value })}
                placeholder="One short line shown in the inbox preview"
              />
            </div>
            <div>
              <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">
                Body (Markdown)
              </Label>
              <Textarea
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                rows={20}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-events-cream/50 mt-1 font-body">
                Use {"{first_name}"}, {"{connect_url}"}, {"{dashboard_url}"} as variables. Supports **bold**, [label](url), and "- " lists.
              </p>
            </div>
            <Button
              onClick={save}
              disabled={saving}
              className="bg-events-coral hover:bg-events-coral/90 text-events-cream"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
