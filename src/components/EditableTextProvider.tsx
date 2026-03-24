import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EditableTextContextValue {
  settings: Record<string, string>;
  isAdmin: boolean;
  loading: boolean;
  pageSlug: string;
  setSetting: (key: string, value: string) => Promise<any>;
}

const EditableTextContext = createContext<EditableTextContextValue>({
  settings: {},
  isAdmin: false,
  loading: true,
  pageSlug: "",
  setSetting: async () => null,
});

export const useEditableTextContext = () => useContext(EditableTextContext);

interface EditableTextProviderProps {
  pageSlug: string;
  children: ReactNode;
}

export const EditableTextProvider = ({ pageSlug, children }: EditableTextProviderProps) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("event_settings" as any)
        .select("*")
        .eq("event_slug", pageSlug);
      const map: Record<string, string> = {};
      (data as any[])?.forEach((row: any) => {
        map[row.setting_key] = row.setting_value;
      });
      setSettings(map);
      setLoading(false);
    };
    fetchSettings();
  }, [pageSlug]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const setSetting = useCallback(async (key: string, value: string) => {
    const { error } = await (supabase as any)
      .from("event_settings")
      .upsert(
        { event_slug: pageSlug, setting_key: key, setting_value: value },
        { onConflict: "event_slug,setting_key" }
      );
    if (!error) {
      setSettings((prev) => ({ ...prev, [key]: value }));
    }
    return error;
  }, [pageSlug]);

  return (
    <EditableTextContext.Provider value={{ settings, isAdmin, loading, setSetting }}>
      {children}
    </EditableTextContext.Provider>
  );
};
