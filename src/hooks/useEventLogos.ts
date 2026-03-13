import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EventLogo {
  id: string;
  event_slug: string;
  name: string;
  domain: string | null;
  logo_url: string | null;
  url: string | null;
  display_order: number;
}

export const useEventLogos = (eventSlug: string) => {
  const [logos, setLogos] = useState<EventLogo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogos = useCallback(async () => {
    const { data } = await supabase
      .from("event_logos")
      .select("*")
      .eq("event_slug", eventSlug)
      .order("display_order", { ascending: true });
    setLogos((data as unknown as EventLogo[]) || []);
    setLoading(false);
  }, [eventSlug]);

  useEffect(() => {
    fetchLogos();
  }, [fetchLogos]);

  const addLogo = async (logo: {
    name: string;
    domain?: string;
    logo_url?: string;
    url?: string;
  }) => {
    const maxOrder = logos.length > 0 ? Math.max(...logos.map((l) => l.display_order)) + 1 : 0;
    const { error } = await supabase.from("event_logos").insert({
      event_slug: eventSlug,
      name: logo.name,
      domain: logo.domain || null,
      logo_url: logo.logo_url || null,
      url: logo.url || null,
      display_order: maxOrder,
    } as any);
    if (!error) await fetchLogos();
    return error;
  };

  const deleteLogo = async (id: string) => {
    const { error } = await supabase.from("event_logos").delete().eq("id", id);
    if (!error) await fetchLogos();
    return error;
  };

  const reorderLogo = async (id: string, direction: "up" | "down") => {
    const idx = logos.findIndex((l) => l.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= logos.length) return;

    const a = logos[idx];
    const b = logos[swapIdx];
    await Promise.all([
      supabase.from("event_logos").update({ display_order: b.display_order } as any).eq("id", a.id),
      supabase.from("event_logos").update({ display_order: a.display_order } as any).eq("id", b.id),
    ]);
    await fetchLogos();
  };

  return { logos, loading, addLogo, deleteLogo, reorderLogo, refetch: fetchLogos };
};
