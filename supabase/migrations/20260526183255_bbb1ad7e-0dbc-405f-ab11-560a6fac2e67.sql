ALTER VIEW public.afterparty_guest_list SET (security_invoker = off);
GRANT SELECT ON public.afterparty_guest_list TO anon, authenticated;