import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Sparkles, GraduationCap, Compass, Search, ChevronDown, BarChart3, Award, Zap, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const experienceSegments = [
  {
    icon: Award,
    title: "Industry Veterans",
    count: "~185",
    pct: 30,
    yearHighlight: "11+",
    desc: " years of experience. The legacy professionals who've survived multiple economic cycles and brand acquisitions.",
    color: "#E1B624",
  },
  {
    icon: Briefcase,
    title: "Active Insiders",
    count: "~245",
    pct: 40,
    yearHighlight: "6–10",
    desc: " years of experience. Your \"engine room\" — professionals who entered during the massive growth period of the mid-2010s.",
    color: "#5BC0EB",
  },
  {
    icon: ArrowRightLeft,
    title: 'The "Great Pivoters"',
    count: "~110",
    pct: 18,
    yearHighlight: "3–5",
    desc: " years of experience. Career switchers from Tech, Finance, or CPG now seeking to align their work with their outdoor lifestyle.",
    color: "#F5E6D3",
  },
  {
    icon: GraduationCap,
    title: "Industry Newcomers",
    count: "~75",
    pct: 12,
    yearHighlight: "0–2",
    desc: " years of experience. Recent grads and early-career pros specifically targeting the outdoor sector for their first major roles.",
    color: "#19363B",
  },
];

const weGather = [
  {
    icon: Briefcase,
    text: "The outdoor industry's most skilled talent currently innovating at your competitors",
  },
  {
    icon: Compass,
    text: "Outdoorsy folks currently working in sectors like tech, healthcare, aerospace who want to use their skills in a new industry",
  },
  {
    icon: Sparkles,
    text: "Industry tastemakers — leaders, creatives, athletes, influencers — not actively looking for a role, but making sure they know what's next",
  },
  {
    icon: GraduationCap,
    text: "Students and fresh grads hungry for entry-level, retail, or seasonal roles",
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

        {/* CTA to widget — now right after header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setWidgetOpen(!widgetOpen)}
            className="group inline-flex items-center gap-3 bg-black hover:bg-[#19363B] border border-[#E1B624]/40 text-[#F5E6D3] px-6 py-3.5 rounded-xl font-display font-bold transition-all duration-300 shadow-lg"
          >
            <BarChart3 className="w-5 h-5 text-[#E1B624]" />
            <span>Recruiter or Data Nerd? See who comes</span>
            <ChevronDown className={`w-4 h-4 text-[#E1B624] transition-transform duration-300 ${widgetOpen ? 'rotate-180' : ''}`} />
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
              <div className="bg-black border border-[#E1B624]/20 rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-5 h-5 text-[#E1B624]" />
                  <h3 className="font-display font-bold text-[#F5E6D3] text-xl">Filter the Talent Pool</h3>
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
                      <Users className="w-5 h-5 text-[#5BC0EB]" />
                      <span className="font-display font-extrabold text-3xl md:text-4xl text-[#E1B624]">
                        {loading ? '...' : filteredCount}
                      </span>
                    </div>
                    <p className="text-[#F5E6D3]/60 font-body text-sm">
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

        {/* "We gather" stacked list with + signs — now below widget */}
        <div className="mb-20 max-w-3xl mx-auto">
          {weGather.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start gap-4 py-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <p className="text-foreground font-body text-base md:text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
              {i < weGather.length - 1 && (
                <div className="flex items-center gap-3 pl-3">
                  <span className="text-primary font-display font-extrabold text-2xl leading-none">+</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Experience-based segments — horizontal bar visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-8 font-body text-center">
            By Experience Level
          </p>

          {/* Stacked bar */}
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

          {/* Segment cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {experienceSegments.map((seg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-black border rounded-xl p-5 shadow-lg group hover:border-opacity-60 transition-colors"
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
                      <h3 className="font-display font-bold text-[#F5E6D3] text-base">{seg.title}</h3>
                      <p className="text-[#F5E6D3]/50 text-xs font-body">{seg.count} attendees</p>
                    </div>
                  </div>
                  <div
                    className="font-display font-extrabold text-2xl"
                    style={{ color: seg.color }}
                  >
                    {seg.pct}%
                  </div>
                </div>
                <p className="text-[#F5E6D3]/60 text-sm font-body leading-relaxed">
                  <span className="font-display font-extrabold text-base" style={{ color: seg.color }}>{seg.yearHighlight}</span>
                  {seg.desc}
                </p>
                {/* Mini progress bar */}
                <div className="mt-3 h-1 rounded-full bg-[#F5E6D3]/10 overflow-hidden">
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
    <label className="text-xs text-[#F5E6D3]/50 font-body uppercase tracking-wider mb-1.5 block">
      {label}
    </label>
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full bg-[#19363B] border border-[#E1B624]/20 rounded-lg px-3 py-2.5 pr-8 text-sm text-[#F5E6D3] font-body appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5BC0EB]/40 hover:border-[#E1B624]/40 transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E1B624]/60 pointer-events-none" />
    </div>
  </div>
);

export default DenverWhoAttends;
