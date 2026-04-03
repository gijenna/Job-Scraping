import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Expert, ExpertCity, ExpertCityAssignment, ExpertQuestion } from "@/lib/expert-types";
import ExpertCRM from "@/components/experts/ExpertCRM";
import BrandDashboard from "@/components/experts/BrandDashboard";
import ExpertCarousel from "@/components/experts/ExpertCarousel";
import ExpertGrid from "@/components/experts/ExpertGrid";
import AddExpertDialog from "@/components/experts/AddExpertDialog";
import FAQManager from "@/components/experts/FAQManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LayoutGrid, GalleryHorizontalEnd } from "lucide-react";

const AdminExperts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [cities, setCities] = useState<ExpertCity[]>([]);
  const [assignments, setAssignments] = useState<ExpertCityAssignment[]>([]);
  const [questions, setQuestions] = useState<ExpertQuestion[]>([]);
  const [previewMode, setPreviewMode] = useState<'carousel' | 'grid'>('carousel');




  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin');
      return;
    }
    setAuthed(true);
    fetchAll();
  };

  const fetchAll = async () => {
    setLoading(true);
    const [expertsRes, citiesRes, assignmentsRes, questionsRes] = await Promise.all([
      supabase.from('industry_experts').select('*').order('created_at', { ascending: false }),
      supabase.from('expert_cities').select('*').order('name'),
      supabase.from('expert_city_assignments').select('*'),
      supabase.from('expert_questions').select('*').order('created_at', { ascending: false }),
    ]);

    if (expertsRes.data) setExperts(expertsRes.data as unknown as Expert[]);
    if (citiesRes.data) setCities(citiesRes.data as unknown as ExpertCity[]);
    if (assignmentsRes.data) setAssignments(assignmentsRes.data as unknown as ExpertCityAssignment[]);
    if (questionsRes.data) setQuestions(questionsRes.data as unknown as ExpertQuestion[]);
    setLoading(false);
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-events-teal">
      {/* Header */}
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
              Industry Expert <span className="text-events-coral">CRM</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <AddExpertDialog cities={cities} onAdded={fetchAll} />
            <AddExpertDialog cities={cities} onAdded={fetchAll} type="brand_rep" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <Tabs defaultValue="crm" className="space-y-4">
          <TabsList className="bg-events-card border border-events-cream/10">
            <TabsTrigger value="crm" className="data-[state=active]:bg-events-coral data-[state=active]:text-events-cream text-events-cream/60">
              CRM Dashboard
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-events-coral data-[state=active]:text-events-cream text-events-cream/60">
              Card Preview
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-events-coral data-[state=active]:text-events-cream text-events-cream/60">
              FAQ ({questions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crm">
            {loading ? (
              <p className="text-events-cream/40 text-center py-12">Loading...</p>
            ) : (
              <div className="space-y-10">
                <BrandDashboard experts={experts} assignments={assignments} cities={cities} onRefresh={fetchAll} />
                <div>
                  <h3 className="font-display text-lg font-bold text-events-cream mb-4 flex items-center gap-2">
                    <span className="text-events-coral">People</span> CRM
                    <span className="text-events-cream/40 text-sm font-normal">
                      ({experts.filter(e => {
                        const assigns = assignments.filter(a => a.expert_id === e.id);
                        return assigns.some(a => a.expert_type === 'industry_expert') || e.status === 'confirmed';
                      }).length})
                    </span>
                  </h3>
                  <ExpertCRM experts={experts} assignments={assignments} cities={cities} onRefresh={fetchAll} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-events-cream/60 text-sm">Display mode:</span>
                <Button
                  size="sm"
                  variant={previewMode === 'carousel' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('carousel')}
                  className={previewMode === 'carousel' ? 'bg-events-coral text-events-cream' : 'text-events-cream/60'}
                >
                  <GalleryHorizontalEnd className="w-4 h-4 mr-1" /> Carousel
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('grid')}
                  className={previewMode === 'grid' ? 'bg-events-coral text-events-cream' : 'text-events-cream/60'}
                >
                  <LayoutGrid className="w-4 h-4 mr-1" /> Grid
                </Button>
              </div>

              {previewMode === 'carousel' ? (
                <ExpertCarousel experts={experts} />
              ) : (
                <ExpertGrid experts={experts} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <FAQManager questions={questions} onRefresh={fetchAll} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminExperts;
