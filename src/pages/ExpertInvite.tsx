import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const ExpertInvite = () => {
  const { eventSlug, token } = useParams<{ eventSlug: string; token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [expertName, setExpertName] = useState("");
  const [expertTitle, setExpertTitle] = useState("");
  const [expertCompany, setExpertCompany] = useState("");
  const [expertPhoto, setExpertPhoto] = useState<File | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setIsAdmin(!!session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      try {
        const { data: invite, error } = await supabase
          .from("expert_invites")
          .select("event_slug, expert_name, expert_title, expert_company, expert_photo, claimed_at")
          .eq("event_slug", eventSlug)
          .eq("token", token)
          .single();

        if (error) {
          setError("Invalid or expired invite link.");
          return;
        }

        if (!invite) {
          setError("Invite not found.");
          return;
        }

        setExpertName(invite.expert_name || "");
        setExpertTitle(invite.expert_title || "");
        setExpertCompany(invite.expert_company || "");
        setIsClaimed(!!invite.claimed_at);

        const { data: event } = await supabase
          .from("events")
          .select("title")
          .eq("slug", eventSlug)
          .single();

        setEventTitle(event?.title || "the event");
      } catch (err: any) {
        setError("Failed to verify invite: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [eventSlug, token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let photoUrl: string | null = null;
      if (expertPhoto) {
        const ext = expertPhoto.name.split(".").pop();
        const filePath = `expert-photos/${eventSlug}/${token}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("event-photos").upload(filePath, expertPhoto, {
          cacheControl: "3600",
          upsert: false,
        });

        if (uploadError) {
          setError(`Photo upload failed: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }

        const { data } = supabase.storage.from("event-photos").getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("expert_invites")
        .update({
          expert_title: expertTitle,
          expert_company: expertCompany,
          expert_photo: photoUrl,
          claimed_at: new Date().toISOString(),
        })
        .eq("event_slug", eventSlug)
        .eq("token", token);

      if (error) {
        setError(`Failed to claim invite: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setIsClaimed(true);
      toast({
        title: "Success!",
        description: "Your info has been saved.",
      });
    } catch (err: any) {
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipClaim = () => {
    navigate(`/gather-denver`);
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (isClaimed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-card rounded-lg shadow-lg p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground font-display">
              Invite Claimed!
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Thanks, {expertName}! Your information has been saved.
            </p>
          </div>
          <div className="space-y-4">
            <Button onClick={skipClaim} className="w-full">
              Continue to {eventTitle}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card rounded-lg shadow-lg p-8">
        <div>
          <img
            className="mx-auto h-16 md:h-20"
            src="https://basecampoutdoor.com/wp-content/uploads/2023/09/Basecamp_Logo_MAIN_1.png"
            alt="Basecamp Outdoor"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground font-display">
            Claim Your Spot
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Complete your profile to be featured as an industry expert at {eventTitle}.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="expertName" className="block text-sm font-medium text-foreground">
                Your Name
              </Label>
              <Input
                id="expertName"
                type="text"
                value={expertName}
                onChange={(e) => setExpertName(e.target.value)}
                required
                className="mt-1 block w-full"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="expertTitle" className="block text-sm font-medium text-foreground">
                Your Title
              </Label>
              <Input
                id="expertTitle"
                type="text"
                value={expertTitle}
                onChange={(e) => setExpertTitle(e.target.value)}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <Label htmlFor="expertCompany" className="block text-sm font-medium text-foreground">
                Your Company
              </Label>
              <Input
                id="expertCompany"
                type="text"
                value={expertCompany}
                onChange={(e) => setExpertCompany(e.target.value)}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <Label htmlFor="expertPhoto" className="block text-sm font-medium text-foreground">
                Upload Your Photo
              </Label>
              <Input
                id="expertPhoto"
                type="file"
                accept="image/*"
                onChange={(e) => setExpertPhoto(e.target.files?.[0] || null)}
                className="mt-1 block w-full"
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-card-foreground bg-secondary hover:bg-secondary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRight className={cn("h-5 w-5 text-card-foreground group-hover:text-background", isSubmitting ? "animate-spin" : "")} aria-hidden="true" />
              </span>
              {isSubmitting ? "Submitting..." : "Claim Your Spot"}
            </Button>
          </div>
        </form>

        {isAdmin && (
          <section className="py-12 px-6">
            <div className="container mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-8">
                  Admin Override
                </h2>
                <a
                  href={`/admin/expert-invite/${eventSlug}/${token}`}
                  className="inline-block bg-[#E1B624] hover:bg-[#E1B624]/90 text-black font-display font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 mb-6"
                >
                  Edit this invite
                </a>
              </motion.div>
            </div>
          </section>
        )}

        <div className="mt-6">
          <h2 className="text-center text-3xl font-extrabold text-foreground font-display">
            Become an
            <span> Industry Expert</span>
            at {eventTitle}.
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Complete your profile to be featured.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertInvite;
