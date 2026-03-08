export interface Expert {
  id: string;
  full_name: string;
  email: string | null;
  slug: string;
  job_title: string | null;
  current_company: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  field_of_work: string | null;
  years_in_industry: number | null;
  years_in_city: number | null;
  ask_me_about: string | null;
  favorite_media: string | null;
  previous_companies: string | null;
  niche_interests: string[];
  status: 'invited' | 'viewed' | 'started' | 'confirmed';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpertCity {
  id: string;
  slug: string;
  name: string;
  event_title: string;
  event_date: string | null;
  event_location: string | null;
  event_time_details: string | null;
  arrival_time: string | null;
  branding_color: string;
  hero_image_url: string | null;
  active: boolean;
}

export interface ExpertCityAssignment {
  id: string;
  expert_id: string;
  city_slug: string;
  card_version: Record<string, any>;
  published: boolean;
  created_at: string;
}

export interface ExpertQuestion {
  id: string;
  expert_id: string | null;
  expert_name: string | null;
  city_slug: string | null;
  question_text: string;
  admin_answer: string | null;
  show_in_faq: boolean;
  created_at: string;
}

export const FIELD_OPTIONS = [
  'Executive Leadership',
  'Marketing & Brand Strategy',
  'Product Management',
  'Design & Creative',
  'Engineering & Technology',
  'Sales & Business Development',
  'Operations & Supply Chain',
  'Retail & Merchandising',
  'Sustainability & Impact',
  'Finance',
  'People & Culture',
  'Media & Content',
  'Athletics',
  'Recreation & Guiding',
  'Other',
] as const;

export const NICHE_OPTIONS = [
  'Running', 'Hiking', 'Climbing', 'Skiing', 'Snowboarding',
  'Mountain Biking', 'Trail Running', 'Camping', 'Fishing',
  'Kayaking', 'Surfing', 'Backpacking', 'Yoga', 'CrossFit',
  'Cycling', 'Paddleboarding', 'Hunting', 'Birdwatching',
] as const;

export function getCompanyLogoUrl(company: string): string {
  const domain = company.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/inc$|llc$|corp$|co$/, '');
  return `https://logo.clearbit.com/${domain}.com`;
}

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
