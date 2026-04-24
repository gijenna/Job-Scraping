import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expertName: string;
  citySlug: string;
  expertId?: string;
}

const QuestionDialog = ({ open, onOpenChange, expertName, citySlug, expertId }: QuestionDialogProps) => {
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase.from('expert_questions').insert({
        expert_id: expertId || null,
        expert_name: expertName || 'Unknown',
        city_slug: citySlug,
        question_text: question.trim(),
      });

      if (error) throw error;

      toast({
        title: "Question sent!",
        description: "We'll get back to you soon. You can still fill out your profile in the meantime!",
      });
      setQuestion("");
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-events-teal border-events-cream/20 text-events-cream max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-events-coral">I have questions first</DialogTitle>
        </DialogHeader>
        <p className="text-events-cream/60 text-sm">
          Ask us anything! This won't stop you from filling out your profile, you can still click "I'm In" anytime.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to know?"
            className="bg-events-card border-events-cream/20 text-events-cream placeholder:text-events-cream/30 min-h-[100px]"
            required
          />
          <Button
            type="submit"
            disabled={sending || !question.trim()}
            className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream"
          >
            <Send className="w-4 h-4 mr-1" /> {sending ? "Sending..." : "Send Question"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDialog;
