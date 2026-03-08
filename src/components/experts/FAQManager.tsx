import { useState } from "react";
import { ExpertQuestion } from "@/lib/expert-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";

interface FAQManagerProps {
  questions: ExpertQuestion[];
  onRefresh: () => void;
}

const FAQManager = ({ questions, onRefresh }: FAQManagerProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const submitAnswer = async (questionId: string) => {
    const answer = answers[questionId];
    if (!answer?.trim()) return;

    const { error } = await supabase
      .from('expert_questions')
      .update({ admin_answer: answer.trim() })
      .eq('id', questionId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Answer saved" });
      setAnswers(prev => ({ ...prev, [questionId]: '' }));
      onRefresh();
    }
  };

  const toggleFAQ = async (questionId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('expert_questions')
      .update({ show_in_faq: !currentValue })
      .eq('id', questionId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      onRefresh();
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-events-coral flex items-center gap-2">
        <MessageSquare className="w-5 h-5" /> Expert Questions
      </h3>

      {questions.length === 0 ? (
        <p className="text-events-cream/40 text-sm py-4">No questions submitted yet.</p>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-events-card rounded-lg border border-events-cream/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-events-cream text-sm font-medium">{q.expert_name || 'Anonymous'}</span>
                    {q.city_slug && (
                      <span className="text-events-cream/40 text-xs">{q.city_slug}</span>
                    )}
                  </div>
                  <p className="text-events-cream/80 text-sm">{q.question_text}</p>

                  {q.admin_answer && (
                    <p className="text-events-yellow/80 text-sm mt-2 pl-3 border-l-2 border-events-yellow/30">
                      {q.admin_answer}
                    </p>
                  )}

                  {!q.admin_answer && (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your answer..."
                        className="bg-events-teal border-events-cream/20 text-events-cream text-sm h-8"
                      />
                      <Button
                        size="sm"
                        onClick={() => submitAnswer(q.id)}
                        className="bg-events-coral hover:bg-events-coral/90 h-8"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-events-cream/40 text-xs">FAQ</span>
                  <Switch
                    checked={q.show_in_faq}
                    onCheckedChange={() => toggleFAQ(q.id, q.show_in_faq)}
                    disabled={!q.admin_answer}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQManager;
