// Shared candidate profile completeness calculation.
// Used by both the profile editor (ConnectFull) and the map banner (ConnectHome)
// so the two surfaces never disagree.

export const COMPLETENESS_FIELDS = [
  "first_name", "last_name", "email", "phone", "photo_url", "career_stage", "poachable_status",
  "field", "focus", "years_in_current_field", "areas_of_expertise", "niche_experience",
  "dream_role_title", "job_types_seeking", "min_pay_rate", "current_location", "remote_preference",
  "workplace_type_preference", "total_years_professional", "prior_careers", "outdoor_industry_experience",
  "management_experience", "the_hook", "the_pitch", "current_title", "current_company", "linkedin_url",
  "portfolio_url", "dream_companies", "resume_url",
] as const;

export function calcProfileCompleteness(candidate: Record<string, any> | null | undefined): number {
  if (!candidate) return 0;
  let filled = 0;
  for (const f of COMPLETENESS_FIELDS) {
    const v = candidate[f];
    if (Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== "" && v !== 0) filled++;
    else if (typeof v === "number" && v > 0) filled++;
  }
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
}
