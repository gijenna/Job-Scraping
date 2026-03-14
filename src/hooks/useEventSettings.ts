import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useEventSettings = (eventSlug: string) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("event_settings" as any)
      .select("*")
      .eq("event_slug", eventSlug);
    const map: Record<string, string> = {};
    (data as any[])?.forEach((row: any) => {
      map[row.setting_key] = row.setting_value;
    });
    setSettings(map);
    setLoading(false);
  }, [eventSlug]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const setSetting = useCallback(async (key: string, value: string) => {
    // Upsert
    const { error } = await (supabase as any)
      .from("event_settings")
      .upsert(
        { event_slug: eventSlug, setting_key: key, setting_value: value },
        { onConflict: "event_slug,setting_key" }
      );
    if (!error) {
      setSettings((prev) => ({ ...prev, [key]: value }));
    }
    return error;
  }, [eventSlug]);

  return { settings, loading, setSetting, refetch: fetchSettings };
};
