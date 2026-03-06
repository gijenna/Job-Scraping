import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
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

  return (
    <div className="min-h-screen bg-[#0D3B3E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-[#F5F0E8] font-display text-3xl font-bold text-center mb-2">
          {isSignUp ? "Create Admin Account" : "Admin Sign In"}
        </h1>
        <p className="text-[#F5F0E8]/60 text-center text-sm mb-8">
          {isSignUp ? "Set up your admin account to manage events" : "Sign in to manage events"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#F5F0E8]">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#F5F0E8]/10 border-[#F5F0E8]/20 text-[#F5F0E8] placeholder:text-[#F5F0E8]/40"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#F5F0E8]">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-[#F5F0E8]/10 border-[#F5F0E8]/20 text-[#F5F0E8] placeholder:text-[#F5F0E8]/40"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E85D4A] hover:bg-[#E85D4A]/90 text-[#F5F0E8] font-semibold"
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-6 w-full text-center text-[#F5F0E8]/60 hover:text-[#F5F0E8] text-sm transition-colors"
        >
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>

        <button
          onClick={() => navigate("/events")}
          className="mt-2 w-full text-center text-[#F5F0E8]/40 hover:text-[#F5F0E8]/60 text-xs transition-colors"
        >
          ← Back to events
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
