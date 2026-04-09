export type ExpertType = 'industry_expert' | 'brand_rep';

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
  company_domains: Record<string, string>;
  status: 'invited' | 'viewed' | 'started' | 'confirmed';
  saved_for_later?: boolean;
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
  expert_type: ExpertType;
  display_order?: number;
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

const COMPANY_DOMAINS: Record<string, string> = {
  'rei': 'rei.com',
  'patagonia': 'patagonia.com',
  'the north face': 'thenorthface.com',
  'nike': 'nike.com',
  'adidas': 'adidas.com',
  'columbia': 'columbia.com',
  'google': 'google.com',
  'apple': 'apple.com',
  'amazon': 'amazon.com',
  'microsoft': 'microsoft.com',
  'cotopaxi': 'cotopaxi.com',
  'black diamond': 'blackdiamondequipment.com',
  'vail resorts': 'vailresorts.com',
  'smartwool': 'smartwool.com',
  'lululemon': 'lululemon.com',
  'on running': 'on-running.com',
  'garmin': 'garmin.com',
  'keen': 'keenfootwear.com',
  'basecamp outdoor': 'basecampoutdoor.com',
  'backbone media': 'backbonemedia.com',
  'outside inc': 'outsideinc.com',
  'deloitte': 'deloitte.com',
  'arcteryx': 'arcteryx.com',
  'marriott': 'marriott.com',
  'kpmg': 'kpmg.com',
  'six moon designs': 'sixmoondesigns.com',
};

export function getCompanyLogoUrl(company: string, domainOverrides?: Record<string, string> | null): string | null {
  const key = company.toLowerCase().trim();
  if (domainOverrides) {
    const overrideKey = Object.keys(domainOverrides).find(k => k.toLowerCase().trim() === key);
    if (overrideKey && domainOverrides[overrideKey]) {
      const d = domainOverrides[overrideKey].replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      return `https://www.google.com/s2/favicons?domain=${d}&sz=128`;
    }
  }
  const domain = COMPANY_DOMAINS[key];
  if (domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }
  return null;
}

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
