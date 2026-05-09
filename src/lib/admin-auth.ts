import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_DOMAIN = "@wearetheoutdoorindustry.com";

/**
 * Real admin = signed-in Supabase user with a @wearetheoutdoorindustry.com email.
 * Anonymous sessions (e.g. afterparty PIN guests) and any other domain are NOT admin.
 */
export const isAdminUser = (user: any): boolean => {
  if (!user) return false;
  if (user.is_anonymous === true) return false;
  const email = (user.email || "").toLowerCase().trim();
  if (!email) return false;
  return email.endsWith(ADMIN_DOMAIN);
};

export const isAdminSession = (session: any): boolean => isAdminUser(session?.user);

export const useIsAdmin = (): boolean => {
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setAdmin(isAdminUser(session?.user));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAdmin(isAdminUser(session?.user));
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);
  return admin;
};
