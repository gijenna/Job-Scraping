import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ALLOWED_DOMAINS = ["@wearetheoutdoorindustry.com"];

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const domain = email.substring(email.indexOf("@"));
        if (!ALLOWED_DOMAINS.includes(domain.toLowerCase())) {
          toast({
            title: "Unauthorized domain",
            description: "Only @wearetheoutdoorindustry.com and @basecampjobs.com emails can sign up.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Account created!", description: "You're now signed in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
      }
      navigate("/events");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Enter your email first", description: "Type your email address above, then click 'Forgot password?' again.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
      toast({ title: "Reset email sent!", description: `Check ${email} for a password reset link.` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-events-teal flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-events-cream font-display text-3xl font-bold text-center mb-2">
          {isSignUp ? "Create Admin Account" : "Admin Sign In"}
        </h1>
        <p className="text-events-cream/60 text-center text-sm mb-8">
          {isSignUp
            ? "Only @wearetheoutdoorindustry.com and @basecampjobs.com emails allowed"
            : "Sign in to manage events"}
        </p>

        {resetSent ? (
          <div className="text-center space-y-4">
            <p className="text-events-cream">A password reset link has been sent to <strong>{email}</strong>. Check your inbox (and spam folder).</p>
            <button onClick={() => setResetSent(false)} className="text-events-coral hover:text-events-coral/80 text-sm transition-colors">
              ← Back to sign in
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-events-cream">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/40"
                  placeholder="you@basecampjobs.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-events-cream">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/40"
                  placeholder="••••••••"
                />
              </div>

              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-events-coral hover:text-events-coral/80 text-sm transition-colors"
                >
                  Forgot password?
                </button>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-semibold"
              >
                {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="mt-6 w-full text-center text-events-cream/60 hover:text-events-cream text-sm transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>

            <button
              onClick={() => navigate("/events")}
              className="mt-2 w-full text-center text-events-cream/40 hover:text-events-cream/60 text-xs transition-colors"
            >
              ← Back to events
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
