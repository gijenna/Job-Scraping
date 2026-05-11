// Wraps the existing /admin/experts ExpertIntakeForm in a dialog so brand
// reps and industry experts can edit their own record from the dashboard.
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExpertIntakeForm from "@/components/experts/ExpertIntakeForm";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
  rep: any;
  citySlug?: string;
  cityName?: string;
  onSaved: (rep: any) => void;
}

export default function RepEditModal({ open, onClose, rep, citySlug = "denver", cityName = "Denver", onSaved }: Props) {
  const [expertType, setExpertType] = useState<'industry_expert' | 'brand_rep'>('brand_rep');

  useEffect(() => {
    if (!open || !rep?.id) return;
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_type, city_slug")
        .eq("expert_id", rep.id);
      const a = (data || []).find((x: any) => x.city_slug === citySlug) || (data || [])[0];
      if (a?.expert_type === 'industry_expert' || a?.expert_type === 'brand_rep') setExpertType(a.expert_type);
    })();
  }, [open, rep?.id, citySlug]);

  if (!open || !rep) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-events-bg border-events-cream/20 max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-events-cream font-display">Edit my card · {rep.full_name}</DialogTitle>
        </DialogHeader>
        <ExpertIntakeForm
          expertId={rep.id}
          existingData={rep}
          citySlug={citySlug}
          cityName={cityName}
          expertType={expertType}
          onComplete={async (savedExpert) => {
            // Refetch latest record so the dashboard preview reflects it.
            const { data } = await supabase.from("industry_experts").select("*").eq("id", rep.id).maybeSingle();
            onSaved(data || savedExpert || rep);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
