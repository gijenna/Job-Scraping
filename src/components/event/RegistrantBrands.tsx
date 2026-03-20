import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Brand {
  name: string;
  domain: string;
}

interface RegistrantBrandsProps {
  brands: Brand[];
  citySlug: string;
  headline?: string;
  accentColor?: string;
  bgColor?: string;
}

const RegistrantBrands = ({
  brands,
  citySlug,
  headline = "Brands & experts in the room",
  accentColor = "#E1B624",
  bgColor = "#0d1f22",
}: RegistrantBrandsProps) => {
  const [experts, setExperts] = useState<{ full_name: string; current_company: string | null; photo_url: string | null }[]>([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_id, industry_experts(full_name, current_company, photo_url)")
        .eq("city_slug", citySlug)
        .eq("published", true);

      if (data) {
        const mapped = data
          .map((d: any) => d.industry_experts)
          .filter(Boolean);
        setExperts(mapped);
      }
    };
    fetchExperts();
  }, [citySlug]);

  return (
    <section className="py-16 md:py-24 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs tracking-[0.3em] uppercase mb-10 font-body"
          style={{ color: accentColor }}
        >
          {headline}
        </motion.p>

        {/* Brand logos grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
            >
              <BrandLogoWithFallback name={brand.name} domain={brand.domain} />
              <span className="font-body text-xs text-white/50">{brand.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Expert cards */}
        {experts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-center text-xs tracking-[0.2em] uppercase mb-6 font-body text-white/40">
              Industry Experts You'll Meet
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {experts.slice(0, 8).map((expert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 rounded-full px-4 py-2 border border-white/10"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  {expert.photo_url ? (
                    <img
                      src={expert.photo_url}
                      alt={expert.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs"
                      style={{ backgroundColor: accentColor, color: bgColor }}
                    >
                      {expert.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-body text-sm text-white font-medium leading-tight">{expert.full_name}</p>
                    {expert.current_company && (
                      <p className="font-body text-xs text-white/40">{expert.current_company}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RegistrantBrands;
