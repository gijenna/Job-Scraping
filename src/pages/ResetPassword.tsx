import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase redirects here with a recovery token in the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    } else {
      // Listen for auth state to confirm recovery session
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      navigate("/admin");
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
          Reset Password
        </h1>
        <p className="text-events-cream/60 text-center text-sm mb-8">
          Choose a new password for your account
        </p>

        {!ready ? (
          <p className="text-events-cream/60 text-center text-sm">
            Loading recovery session...
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-events-cream">New Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-events-cream">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/40"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-semibold"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}

        <button
          onClick={() => navigate("/admin")}
          className="mt-6 w-full text-center text-events-cream/40 hover:text-events-cream/60 text-xs transition-colors"
        >
          ← Back to sign in
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
