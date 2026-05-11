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
  const [fullRep, setFullRep] = useState<any>(null);

  useEffect(() => {
    if (!open || !rep?.id) return;
    setFullRep(null); // never reuse a stale fetch from a previous open
    (async () => {
      const [{ data: assigns }, { data: freshRep }] = await Promise.all([
        supabase.from("expert_city_assignments").select("expert_type, city_slug").eq("expert_id", rep.id),
        supabase.from("industry_experts").select("*").eq("id", rep.id).maybeSingle(),
      ]);
      const a = (assigns || []).find((x: any) => x.city_slug === citySlug) || (assigns || [])[0];
      if (a?.expert_type === 'industry_expert' || a?.expert_type === 'brand_rep') setExpertType(a.expert_type);
      setFullRep(freshRep || rep);
    })();
  }, [open, rep?.id, citySlug]);

  if (!open || !rep) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-events-bg border-events-cream/20 max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-events-cream font-display">Edit my card · {(fullRep || rep).full_name}</DialogTitle>
        </DialogHeader>
        {fullRep ? (
          <ExpertIntakeForm
            expertId={rep.id}
            existingData={fullRep}
            citySlug={citySlug}
            cityName={cityName}
            expertType={expertType}
            onComplete={async (savedExpert) => {
              const { data } = await supabase.from("industry_experts").select("*").eq("id", rep.id).maybeSingle();
              onSaved(data || savedExpert || fullRep);
              onClose();
            }}
          />
        ) : (
          <div className="py-12 text-center text-events-cream/50 text-sm font-body">Loading your card...</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
