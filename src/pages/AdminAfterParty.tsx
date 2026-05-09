import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/admin-auth";
import AfterPartyAdmin from "@/components/afterparty/AfterPartyAdmin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminAfterParty = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!isAdminUser(user)) {
        if (user) await supabase.auth.signOut();
        navigate('/admin');
        return;
      }
      setAuthed(true);
    })();
  }, [navigate]);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-events-teal">
      <div className="border-b border-events-cream/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/events')}
              className="text-events-cream/60 hover:text-events-cream"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="font-display text-2xl font-bold text-events-cream">
              After Party <span className="text-events-coral">Admin</span>
            </h1>
          </div>
          <Link
            to="/admin/experts"
            className="text-events-cream/60 hover:text-events-cream text-sm underline"
          >
            Expert CRM →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <AfterPartyAdmin />
      </div>
    </div>
  );
};

export default AdminAfterParty;
