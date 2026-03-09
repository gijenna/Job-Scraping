import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Sparkles, GraduationCap, Compass, Search, ChevronDown, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const audienceSegments = [
  {
    icon: Briefcase,
    title: "Industry Pros",
    desc: "The outdoor industry's most skilled talent currently innovating at your competitors.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Compass,
    title: "Cross-Sector Talent",
    desc: "Outdoorsy folks currently working in sectors like tech, healthcare, and aerospace who want to use their skills in a new industry.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Sparkles,
    title: "Industry Tastemakers",
    desc: "Leaders, creatives, athletes, and influencers not actively looking for a role — but making sure they know what's next.",
    color: "text-[hsl(45,80%,55%)]",
    bgColor: "bg-[hsl(45,80%,55%)]/10",
  },
  {
    icon: GraduationCap,
    title: "Emerging Talent",
    desc: "Students and fresh grads hungry for entry-level, retail, or seasonal roles.",
    color: "text-[hsl(150,40%,55%)]",
    bgColor: "bg-[hsl(150,40%,55%)]/10",
  },
];

interface FilterOptions {
  fields: string[];
  years: string[];
  workTypes: string[];
  regions: string[];
}

const DenverWhoAttends = () => {
  const [options, setOptions] = useState<FilterOptions>({ fields: [], years: [], workTypes: [], regions: [] });
  const [total, setTotal] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [filters, setFilters] = useState<Record<string, string | null>>({
    field: null,
    years: null,
    workType: null,
    region: null,
  });
  const [loading, setLoading] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchData = useCallback(async (currentFilters: Record<string, string | null>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('attendee-stats', {
        body: { filters: currentFilters },
      });
      if (error) throw error;
      if (data?.success) {
        setOptions(data.options);
        setTotal(data.total);
        setFilteredCount(data.filtered);
        setInitialized(true);
      }
    } catch (err) {
      console.error('Failed to fetch attendee stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (widgetOpen && !initialized) {
      fetchData(filters);
    }
  }, [widgetOpen, initialized, fetchData, filters]);

  const handleFilterChange = (key: string, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const clearFilters = () => {
    const empty = { field: null, years: null, workType: null, region: null };
    setFilters(empty);
    fetchData(empty);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== null);

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            The Talent Pool
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Who Attends
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            We gather four distinct groups — each with something your brand needs.
          </p>
        </motion.div>

        {/* Audience segments */}
        <div className="space-y-4 mb-16">
          {audienceSegments.map((seg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-gradient-card border border-border rounded-xl p-5 shadow-card"
            >
              <div className={`w-10 h-10 rounded-lg ${seg.bgColor} flex items-center justify-center shrink-0 mt-0.5`}>
                <seg.icon className={`w-5 h-5 ${seg.color}`} />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-lg mb-1">{seg.title}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{seg.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => setWidgetOpen(!widgetOpen)}
            className="group inline-flex items-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-6 py-3.5 rounded-xl font-display font-bold transition-all duration-300"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Recruiter or Data Nerd? See who comes</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${widgetOpen ? 'rotate-180' : ''}`} />
          </button>
        </motion.div>

        {/* Filter widget */}
        <AnimatePresence>
          {widgetOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-8 bg-gradient-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-foreground text-xl">Filter the Talent Pool</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <FilterSelect
                    label="Field of Expertise"
                    options={options.fields}
                    value={filters.field}
                    onChange={(v) => handleFilterChange('field', v)}
                    placeholder="All fields"
                  />
                  <FilterSelect
                    label="Years of Experience"
                    options={options.years}
                    value={filters.years}
                    onChange={(v) => handleFilterChange('years', v)}
                    placeholder="Any experience"
                  />
                  <FilterSelect
                    label="Type of Work"
                    options={options.workTypes}
                    value={filters.workType}
                    onChange={(v) => handleFilterChange('workType', v)}
                    placeholder="All types"
                  />
                  <FilterSelect
                    label="Region"
                    options={options.regions}
                    value={filters.region}
                    onChange={(v) => handleFilterChange('region', v)}
                    placeholder="All regions"
                  />
                </div>

                {/* Results */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-display font-extrabold text-3xl md:text-4xl text-primary">
                        {loading ? '...' : filteredCount}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-body text-sm">
                      {hasActiveFilters
                        ? `registered attendees match your criteria (of ${total} total)`
                        : 'total registered attendees'}
                    </p>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-primary text-sm font-body underline hover:opacity-80 transition-opacity"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

interface FilterSelectProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
}

const FilterSelect = ({ label, options, value, onChange, placeholder }: FilterSelectProps) => (
  <div>
    <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1.5 block">
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-body appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default DenverWhoAttends;
