import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MapLayout {
  id: string;
  event_slug: string;
  brand_id: string;
  layout_type: "draft" | "live";
  x: number;
  y: number;
  shape: "line" | "square" | "tshape" | "xshape";
  rotation: number;
  updated_at: string;
}

export function useEventMapLayouts(eventSlug: string, layoutType: "draft" | "live" = "draft") {
  const [layouts, setLayouts] = useState<MapLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLayouts = useCallback(async () => {
    const { data, error } = await supabase
      .from("event_map_layouts")
      .select("*")
      .eq("event_slug", eventSlug)
      .eq("layout_type", layoutType);
    if (error) {
      toast({ title: "Error loading layouts", description: error.message, variant: "destructive" });
    } else {
      setLayouts((data as MapLayout[]) || []);
    }
    setLoading(false);
  }, [eventSlug, layoutType, toast]);

  useEffect(() => { fetchLayouts(); }, [fetchLayouts]);

  const upsertLayout = async (brandId: string, updates: Partial<MapLayout>) => {
    const existing = layouts.find((l) => l.brand_id === brandId);
    if (existing) {
      const { error } = await supabase
        .from("event_map_layouts")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) {
        toast({ title: "Error updating layout", description: error.message, variant: "destructive" });
        return;
      }
      setLayouts((prev) => prev.map((l) => (l.id === existing.id ? { ...l, ...updates } : l)));
    } else {
      const { data, error } = await supabase
        .from("event_map_layouts")
        .insert({
          event_slug: eventSlug,
          brand_id: brandId,
          layout_type: layoutType,
          x: updates.x ?? 0,
          y: updates.y ?? 0,
          shape: updates.shape ?? "line",
          rotation: updates.rotation ?? 0,
        })
        .select()
        .single();
      if (error) {
        toast({ title: "Error placing brand", description: error.message, variant: "destructive" });
        return;
      }
      setLayouts((prev) => [...prev, data as MapLayout]);
    }
  };

  const removeLayout = async (brandId: string) => {
    const existing = layouts.find((l) => l.brand_id === brandId);
    if (!existing) return;
    const { error } = await supabase
      .from("event_map_layouts")
      .delete()
      .eq("id", existing.id);
    if (error) {
      toast({ title: "Error removing placement", description: error.message, variant: "destructive" });
      return;
    }
    setLayouts((prev) => prev.filter((l) => l.id !== existing.id));
  };

  const publish = async () => {
    // Delete existing live layouts
    await supabase
      .from("event_map_layouts")
      .delete()
      .eq("event_slug", eventSlug)
      .eq("layout_type", "live");

    // Copy draft to live
    const liveRows = layouts.map((l) => ({
      event_slug: eventSlug,
      brand_id: l.brand_id,
      layout_type: "live" as const,
      x: l.x,
      y: l.y,
      shape: l.shape,
      rotation: l.rotation,
    }));

    if (liveRows.length > 0) {
      const { error } = await supabase
        .from("event_map_layouts")
        .insert(liveRows);
      if (error) {
        toast({ title: "Publish failed", description: error.message, variant: "destructive" });
        return false;
      }
    }
    toast({ title: "Published!", description: "Map is now live." });
    return true;
  };

  return { layouts, loading, upsertLayout, removeLayout, publish, refetch: fetchLayouts };
}
