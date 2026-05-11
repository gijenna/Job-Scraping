// Wraps BrandCardForm in a dialog for the brand dashboard. Persists via the
// edge function (whitelisted brand fields, scoped to the rep's brand).
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BrandCardForm, { BrandFormValues } from "@/components/event/BrandCardForm";
import { dashboardSaveCard } from "@/lib/connect-session";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
  brand: any;
  onSaved: (brand: any) => void;
}

export default function BrandCardEditModal({ open, onClose, brand, onSaved }: Props) {
  const { toast } = useToast();
  const [fullBrand, setFullBrand] = useState<any>(null);

  useEffect(() => {
    if (!open || !brand?.id) { setFullBrand(null); return; }
    setFullBrand(null);
    (async () => {
      const { data } = await supabase.from("event_map_brands").select("*").eq("id", brand.id).maybeSingle();
      setFullBrand(data || brand);
    })();
  }, [open, brand?.id]);

  if (!brand) return null;
  const src = fullBrand || brand;

  const initial: BrandFormValues = {
    website_url: src.website_url || "",
    offers_remote: src.offers_remote || "",
    currently_hiring: src.currently_hiring || "",
    why_visit_text: src.why_visit_text || "",
    lead_question_intro: src.lead_question_intro || "",
    lead_question_text: src.lead_question_text || "",
    lead_question_option_1: src.lead_question_option_1 || "",
    lead_question_option_2: src.lead_question_option_2 || "",
    lead_question_option_3: src.lead_question_option_3 || "",
  };

  const handleSave = async (patch: BrandFormValues) => {
    try {
      const r = await dashboardSaveCard({ rep_patch: {}, brand_patch: patch as any });
      toast({ title: "Brand card updated" });
      onSaved(r.brand);
      onClose();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
      throw e;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-events-teal border-events-cream/20 max-w-2xl max-h-[92vh] overflow-y-auto text-events-cream">
        <DialogHeader>
          <DialogTitle className="text-events-cream font-display">Edit brand card · {src.name}</DialogTitle>
        </DialogHeader>
        <p className="text-[11px] text-events-cream/55 font-body -mt-2">
          Shared with all reps at {src.name}. Changes appear on the event map and candidate views in real time.
        </p>
        {fullBrand ? (
          <BrandCardForm initial={initial} onSave={handleSave} onCancel={onClose} />
        ) : (
          <div className="py-12 text-center text-events-cream/55 text-sm font-body">Loading brand card...</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
