import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MapBrand {
  id: string;
  event_slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  table_count: number;
  is_activation: boolean;
  sponsor_brand_id: string | null;
  created_at: string;
  offers_remote?: string | null;
  currently_hiring?: string | null;
  culture_blurb?: string | null;
  is_featured?: boolean | null;
  why_visit_text?: string | null;
  sponsor_callout_text?: string | null;
  lead_question_active?: boolean | null;
  lead_question_intro?: string | null;
  lead_question_text?: string | null;
  lead_question_option_1?: string | null;
  lead_question_option_2?: string | null;
  lead_question_option_3?: string | null;
  lead_capture_visible_to_brand?: boolean | null;
  aliases?: string[] | null;
  parent_brand_id?: string | null;
  primary_child?: boolean | null;
  map_size?: "normal" | "large" | "xl" | string | null;
  child_logo_ids?: string[] | null;
  extra_logo_urls?: Array<{ name?: string; url?: string; logo_url?: string }> | null;
}

export function useEventMapBrands(eventSlug: string) {
  const [brands, setBrands] = useState<MapBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBrands = useCallback(async () => {
    const { data, error } = await supabase
      .from("event_map_brands")
      .select("*")
      .eq("event_slug", eventSlug)
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Error loading brands", description: error.message, variant: "destructive" });
    } else {
      setBrands((data as MapBrand[]) || []);
    }
    setLoading(false);
  }, [eventSlug, toast]);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const addBrand = async (brand: Partial<MapBrand>) => {
    const { data, error } = await supabase
      .from("event_map_brands")
      .insert({ event_slug: eventSlug, name: brand.name!, ...brand })
      .select()
      .single();
    if (error) {
      toast({ title: "Error adding brand", description: error.message, variant: "destructive" });
      return null;
    }
    setBrands((prev) => [...prev, data as MapBrand]);
    return data as MapBrand;
  };

  const updateBrand = async (id: string, updates: Partial<MapBrand>) => {
    const { error } = await supabase
      .from("event_map_brands")
      .update(updates)
      .eq("id", id);
    if (error) {
      toast({ title: "Error updating brand", description: error.message, variant: "destructive" });
      return;
    }
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBrand = async (id: string) => {
    const { error } = await supabase
      .from("event_map_brands")
      .delete()
      .eq("id", id);
    if (error) {
      toast({ title: "Error deleting brand", description: error.message, variant: "destructive" });
      return;
    }
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  return { brands, loading, addBrand, updateBrand, deleteBrand, refetch: fetchBrands };
}
