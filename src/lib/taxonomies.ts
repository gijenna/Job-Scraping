export const POACHABLE_STATUS = [
  "Ready to jump",
  "Poachable for the right thing",
  "Just here to network",
] as const;

export const CAREER_STAGE = [
  "I currently work in the outdoor industry",
  "I'm mid-career, looking to transition into the outdoor industry",
  "I'm a student or entry-level",
  "Unsure, just here to explore the outdoor industry",
] as const;

export const JOB_TYPES = [
  "Full-time (year-round)",
  "Part-time (year-round)",
  "Freelance (1099)",
  "Contract/Temporary",
  "Internship/Fellowship",
  "Seasonal (full-time)",
  "Seasonal (part-time)",
] as const;

export const REMOTE_PREFERENCES = [
  "Yes, remote only",
  "Hybrid",
  "No, in-office",
  "Open to anything",
] as const;

export const WORKPLACE_TYPES = [
  "Startup (early-stage, scrappy)",
  "Growth-stage brand",
  "Established/legacy brand",
  "Agency or consultancy",
  "Nonprofit",
  "Government/public sector",
  "Self-employed/freelance",
  "Open to any",
] as const;

export const FOCUSES_BY_FIELD: Record<string, string[]> = {
  "Marketing": ["Brand", "Content", "Social Media", "Performance / Growth", "PR / Communications", "Email / Lifecycle"],
  "Product": ["Product Management", "Product Design", "Hardware Product Dev", "Apparel Product Dev", "Footwear Product Dev"],
  "Design": ["Graphic Design", "Industrial Design", "UX / UI", "Apparel Design", "Photo / Video"],
  "Sales / Account Mgmt": ["Wholesale", "DTC / Ecommerce", "Key Accounts", "Inside Sales", "Field Sales"],
  "Operations": ["Supply Chain", "Logistics", "Planning", "Warehouse / Fulfillment", "Customer Service"],
  "Retail": ["Store Leadership", "Visual Merchandising", "Sales Floor", "Buying / Merchandising"],
  "Manufacturing": ["Production", "Quality", "Sourcing", "Materials"],
  "Sustainability": ["Programs", "Reporting / ESG", "Materials Innovation", "Circularity"],
  "Sponsorship / Athlete / PR": ["Athlete Management", "Sponsorship", "Events", "Media Relations"],
  "Tech / Engineering": ["Software Engineering", "Data / Analytics", "IT", "Ecommerce Platform"],
  "Finance": ["FP&A", "Accounting", "Strategy"],
  "HR / People": ["Recruiting", "People Ops", "L&D", "DEI"],
  "Other": ["Other"],
};

export const FIELDS = Object.keys(FOCUSES_BY_FIELD);
