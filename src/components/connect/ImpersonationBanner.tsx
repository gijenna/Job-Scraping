import { Button } from "@/components/ui/button";

export const ImpersonationBanner = () => (
  <div className="sticky top-0 z-50 w-full bg-events-coral text-events-cream font-body text-xs md:text-sm py-2 px-3 flex items-center justify-between gap-2">
    <span>Admin impersonation active. Be careful, all actions affect the real account.</span>
    <Button
      size="sm"
      variant="secondary"
      className="h-7 text-xs"
      onClick={async () => {
        await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/candidate-auth`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              apikey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || "",
            },
            body: JSON.stringify({ action: "logout" }),
          },
        );
        window.location.href = "/";
      }}
    >
      Exit
    </Button>
  </div>
);
