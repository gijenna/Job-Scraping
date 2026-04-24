import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Sparkles, GraduationCap, Compass, Search, ChevronDown, BarChart3, Award, Zap, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const experienceSegments = [
  {
    icon: Award,
    title: "Industry Veterans",
    count: "~90",
    pct: 28,
    yearHighlight: "11+",
    desc: " years of experience. The PNW lifers who've built careers at Nike, Columbia, and the region's most iconic brands.",
    color: "#FEE123",
  },
  {
    icon: Briefcase,
    title: "Active Insiders",
    count: "~130",
    pct: 40,
    yearHighlight: "6–10",
    desc: " years of experience. Mid-career professionals driving product, marketing, and operations across the outdoor industry.",
    color: "#5BC0EB",
  },
  {
    icon: ArrowRightLeft,
    title: 'Career Pivoters',
    count: "~40",
    pct: 12,
    yearHighlight: "3–5",
    desc: " years of experience. Tech, CPG, and healthcare professionals pivoting into outdoor, bringing fresh skills and perspective.",
    color: "#F5E6D3",
  },
  {
    icon: GraduationCap,
    title: "UO SPM & New Grads",
    count: "~65",
    pct: 20,
    yearHighlight: "0–2",
    desc: " years of experience. University of Oregon's Sports Product Management students and recent grads, the PNW's most specialized emerging talent.",
    color: "#154733",
  },
];

const weGather = [
  {
    icon: Briefcase,
    text: "Professionals currently innovating at Nike, Columbia, On Running, and other PNW outdoor brands",
  },
  {
    icon: Compass,
    text: "Career changers from tech, healthcare, and finance who want to align their work with their outdoor lifestyle",
  },
  {
    icon: Sparkles,
    text: "Industry tastemakers, leaders, creatives, and brand strategists shaping the PNW outdoor scene",
  },
  {
    icon: GraduationCap,
    text: "UO SPM grad students, the pipeline that feeds Nike, Adidas, Columbia, and beyond",
  },
];

interface FilterOptions {
  fields: string[];
  years: string[];
  workTypes: string[];
  regions: string[];
}

const PnwWhoAttends = () => {
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
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: "#ED7660" }}>
            The Talent Pool
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Who Attends
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            We gather four distinct groups, each with something your brand needs.
          </p>
        </motion.div>

        {/* CTA to widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setWidgetOpen(!widgetOpen)}
            className="group inline-flex items-center gap-3 border px-6 py-3.5 rounded-xl font-display font-bold transition-all duration-300 shadow-lg"
            style={{ backgroundColor: "#FEE123", borderColor: "#FEE123", color: "#154733" }}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Recruiter or Data Nerd? See who comes</span>
            <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${widgetOpen ? 'rotate-180' : ''}`} />
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
              className="overflow-hidden mb-16"
            >
              <div className="bg-black border rounded-2xl p-6 md:p-8 shadow-xl" style={{ borderColor: "rgba(254, 225, 35, 0.2)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-5 h-5" style={{ color: "#FEE123" }} />
                  <h3 className="font-display font-bold text-xl" style={{ color: "#F5E6D3" }}>Filter the Talent Pool</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <FilterSelect label="Field of Expertise" options={options.fields} value={filters.field} onChange={(v) => handleFilterChange('field', v)} placeholder="All fields" />
                  <FilterSelect label="Years of Experience" options={options.years} value={filters.years} onChange={(v) => handleFilterChange('years', v)} placeholder="Any experience" />
                  <FilterSelect label="Type of Work" options={options.workTypes} value={filters.workType} onChange={(v) => handleFilterChange('workType', v)} placeholder="All types" />
                  <FilterSelect label="Region" options={options.regions} value={filters.region} onChange={(v) => handleFilterChange('region', v)} placeholder="All regions" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#5BC0EB]" />
                      <span className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "#FEE123" }}>
                        {loading ? '...' : filteredCount}
                      </span>
                    </div>
                    <p className="text-sm font-body" style={{ color: "rgba(245, 230, 211, 0.6)" }}>
                      {hasActiveFilters
                        ? `registered attendees match your criteria (of ${total} total)`
                        : 'total registered attendees'}
                    </p>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[#5BC0EB] text-sm font-body underline hover:opacity-80 transition-opacity"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience segments */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-8 font-body text-center" style={{ color: "#ED7660" }}>
            By Experience Level
          </p>

          <div className="flex rounded-full overflow-hidden h-3 mb-8">
            {experienceSegments.map((seg, i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: `${seg.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                style={{ backgroundColor: seg.color }}
                className="h-full"
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {experienceSegments.map((seg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-black border rounded-xl p-5 shadow-lg"
                style={{ borderColor: `${seg.color}33` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${seg.color}20` }}
                    >
                      <seg.icon className="w-5 h-5" style={{ color: seg.color }} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base" style={{ color: "#F5E6D3" }}>{seg.title}</h3>
                      <p className="text-xs font-body" style={{ color: "rgba(245, 230, 211, 0.5)" }}>{seg.count} attendees</p>
                    </div>
                  </div>
                  <div className="font-display font-extrabold text-2xl" style={{ color: seg.color }}>
                    {seg.pct}%
                  </div>
                </div>
                <p className="text-sm font-body leading-relaxed" style={{ color: "rgba(245, 230, 211, 0.6)" }}>
                  <span className="font-display font-extrabold text-base" style={{ color: seg.color }}>{seg.yearHighlight}</span>
                  {seg.desc}
                </p>
                <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(245, 230, 211, 0.1)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${seg.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
  <div className="relative">
    <label className="text-xs font-body uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(245, 230, 211, 0.5)" }}>
      {label}
    </label>
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full border rounded-lg px-3 py-2.5 pr-8 text-sm font-body appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-colors"
        style={{
          backgroundColor: "#154733",
          borderColor: "rgba(254, 225, 35, 0.2)",
          color: "#F5E6D3",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(254, 225, 35, 0.6)" }} />
    </div>
  </div>
);

export default PnwWhoAttends;
