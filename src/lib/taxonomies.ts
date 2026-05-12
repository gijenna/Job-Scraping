// Phase 2 taxonomies. Constants for now; lift to a `taxonomies` DB table later
// if Jenna wants admin editing. No em dashes anywhere in user-facing strings.

export const POACHABLE_STATUS = [
  "Ready to jump",
  "Always open to the right opportunity",
  "I'm off market",
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
  "Only seeking remote roles",
  "Open to hybrid",
  "Open to in-office",
  "Anything goes",
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

// 23-field ladder. Each field maps to its focus list.
export const FOCUSES_BY_FIELD: Record<string, string[]> = {
  "Administrative/Virtual assistant": ["Administrative Assistant", "Account Management", "Customer Service", "Data Entry", "Executive Support", "File Clerk", "Office Management", "Personal Services", "Recreation Administration", "Virtual Assistant"],
  "Communication & PR": ["Ambassador Management", "B2B Communications", "Brand Development", "Content Creation", "Corporate/Internal Communications", "Copywriting", "Customer Service", "Crisis Communications", "Digital Marketing", "Graphic Design", "Editing", "Email Marketing", "Events", "Marketing", "Media Relations", "Project Management", "Public Relations", "Public Affairs", "Social Media Coordination", "Video editing", "Writing", "Writing Press Releases"],
  "Creative": ["Art Direction", "Ambassador/Athlete", "Art/Artist", "Branding", "Communications", "Content Creation", "Creative Direction", "Customer Service", "Design", "Editing", "Event Management", "Experiential Marketing", "Film/Videography", "Graphic Design", "Illustration", "Marketing", "Model", "Mural", "Packaging", "Photography", "Print Design", "Production", "Project Management", "Social Media", "Storytelling"],
  "Customer Service": ["Account Management", "Call Center Services", "Customer Insights", "Customer Success", "Customer Support Services", "Customer Service Management", "Desktop Support", "Guest Services", "Project Management", "Retail Services", "Technical Support", "Training", "Social Media Support", "Warranty & Repair"],
  "Design": ["Art Direction", "Apparel Design", "Branding", "Digital Design", "eCommerce", "Graphic Design", "Illustration", "Packaging", "Print Design", "Product/Gear Design", "Sustainable Design", "Typography", "UI/UX Design", "Web Design"],
  "Education Training & Coaching": ["Administration", "Coaching", "Conservation Education", "Counselor", "DEI", "Education", "Guiding", "Leadership", "Outdoor Education", "Staff Development", "Teaching"],
  "Finance": ["Accounts Payable", "Accounts Receivable", "Accounting", "Audit", "Compliance", "Corporate Development", "Financial Planning & Analysis", "Financial Reporting & Consolidation", "Fundraising", "Revenue Operations", "Tax", "Treasury"],
  "Legal": ["Contracts & Document Review", "Copyright & Trademarks", "General Counsel", "IP", "Litigation", "Paralegal", "Regulatory"],
  "Manufacturing/Supply Chain": ["Buying/Procurement", "Demand", "Distribution", "Logistics", "Plant Management", "Production", "Supply Chain", "Sustainability", "Transportation", "Quality"],
  "Marketing": ["Advertising", "B2B Marketing", "Branding/Creative", "Communications", "Community", "Content", "Customer Service", "Design", "Data Analytics & Reporting", "Digital Marketing", "Editorial & Content Management", "Email marketing", "Event Marketing", "Event Planning", "Growth Marketing", "Market Research", "Marketing Strategy", "Media Buying", "Partnerships/Community", "Partnerships/Development", "Photography", "Product Marketing", "Project Management", "Social Media Management", "Videography"],
  "Operations": ["Buying/Procurement", "Change Management", "Customer Service", "Data", "Event Production", "Facilities & Warehouse Management", "General Management", "Logistics", "Operations Management", "Operations Project Management", "Performance Improvement", "Project Management", "Program Development", "Program Management", "Quality Control", "Supply Chain Management", "Strategy", "Training"],
  "Outdoor Recreation": ["Administration", "Counselor", "Guiding", "Leadership", "Principles Education (Leave No Trace etc)", "Recreation Planning", "Teaching", "Youth Education"],
  "People & Culture (incl. DEI)": ["Advocacy", "DEI", "Employee Engagement", "Human Resources", "Human Resources Coordination", "Human Resources Technology", "Labor Relations", "Organizational Development & Effectiveness", "Payroll & Benefits", "People & Culture", "Social Impact", "Staffing & Recruiting", "Talent Acquisition", "Training & Development"],
  "Policy/Advocacy/Government": ["Affinity Group Leadership", "Advocacy", "DEI/Social Justice", "Development", "Fundraising", "Grant Writing", "Non-profit Leadership", "Philanthropy", "Policy/Government", "Social Impact"],
  "Product Design/Development": ["CAD Drawing", "Color development", "Design/Development", "Innovation", "Product Line Management", "Production", "Sustainability/Materials", "Testing"],
  "Retail": ["Buying", "eCommerce", "Management", "Merchandising", "Sales", "Visual Merchandising"],
  "Sales": ["Account Management", "B2B Sales", "Brand Representation", "Business Analysis", "Sales Management", "Business Development", "Key Accounts", "Sales Operations & Support", "Territory Sales"],
  "Science/Conservation": ["Archaeology", "Conservation", "Data", "Ecology", "Environmental", "Geologist", "GIS", "Nutrition", "Outdoor education", "Sustainability"],
  "Tech/Engineering": ["Business Intelligence", "Database Administration", "Engineering (Data)", "IT Security & Governance", "Mobile Development", "Product Management", "Technology Architecture", "Technology Management", "Software Development", "Systems & Network Development", "Quality Assurance", "UI/UX Design", "Website Design/Development"],
  "Tourism": ["Adventure Programming", "Customer Service", "Guiding", "Hotel Management", "Operations", "Travel Sales", "Volunteerism"],
  "Working Outdoors (Field Work / Seasonal Work)": ["Crew Leadership", "Customer Service", "Education", "Emergency Medicine", "Gear Testing", "Guiding", "Seasonal Work", "Trip Leading", "Trail Building/Maintenance", "Trail Design/Development", "Park Ranger", "Photography", "Program Management", "Wilderness Medicine"],
  "Writing/Editing/Journalism": ["Blogging", "Broadcast Journalism", "Content Creation", "Copyediting", "Digital Editing", "Freelance Writing", "Journalism", "Media", "Print Editing", "Writing"],
  "Other": ["Other"],
};

export const FIELDS = Object.keys(FOCUSES_BY_FIELD);

// 28 niches. Used for niche_experience (years optional per niche).
export const NICHES = [
  "Backpacking", "Camping", "Conservation", "Cycling", "Dogs", "Fishing", "Fitness",
  "Hiking", "Hunting", "Lifestyle", "Motorsports", "Mountain Biking", "Mountaineering",
  "Multisport", "Nutrition", "Overlanding", "Paddling", "Road Running", "Rock Climbing",
  "Skiing", "Snowboarding", "Surfing", "Sustainability", "Trail Running", "Travel",
  "Winter Sports", "Yoga/Wellness", "Golf",
] as const;

// 22 categories, 370 skills. Searchable multi-select with category headers.
export const SKILL_CATEGORIES: Record<string, string[]> = {
  "Marketing & Communications": ["Brand marketing", "Brand strategy", "Brand partnerships", "Branding", "Communications", "Content creation", "Content strategy", "Copywriting", "Crisis management", "Digital marketing", "Direct mail", "Email marketing", "Experiential marketing", "Field marketing", "Go-to-market strategy", "Growth marketing", "Influencer marketing", "Integrated marketing", "Lifecycle marketing", "Marketing automation", "Marketing operations", "Marketing strategy", "Media buying", "Paid media", "Performance marketing", "PR", "Product marketing", "Recruitment marketing", "Retail marketing", "SEM", "SEO", "Social media management", "Social media marketing", "Sports marketing", "Storytelling", "Trade shows"],
  "Creative & Design": ["3D design", "Activewear design", "Animation", "Apparel design", "Art/Artist", "Brand voice", "CAD design", "Color design", "Color grading", "Creative direction", "Creative production", "Drawing", "Editorial (publication)", "Film photography", "Footwear design", "Graphic design", "Illustration", "Industrial design", "Infographics", "Interior design", "Lettering", "Logo design", "Motion design", "Mural", "Outerwear design", "Package design", "Packaging design", "Painting", "Pattern design", "Photography", "Print", "Print design", "Product design", "Sketching", "Soft goods design", "Surface pattern design", "Technical apparel design", "Technical outerwear design", "Textile design", "Typography", "UX design", "Video production", "Visual communication", "Web design"],
  "Sales & Business Development": ["Account management", "B2B sales", "Brand ambassador", "Business development", "Channel sales", "Cold calling", "Consumer marketing", "Customer success", "Direct response", "Inside sales", "Key account management", "Outside sales", "Prospecting", "Retail sales", "Sales", "Sales enablement", "Sales management", "Software sales", "Territory sales", "Third party sales", "Upselling"],
  "Customer Experience": ["Client experience", "Customer engagement", "Customer service", "Customer service management", "Guest relations", "Guest services", "Help desk", "Loyalty", "Reservations", "Technical support"],
  "People HR & Culture": ["Benefits administration", "Coaching", "Compensation", "DEI", "Employer branding", "Facilitation", "HR", "HRIS", "Internal communications", "Internal investigations", "Labor relations", "Leadership coaching", "Leadership development", "Mentoring", "Organizational development", "Payroll", "People & culture", "People management", "Performance management", "Recruiting", "Size inclusion work", "Talent management", "Team building", "Team leadership", "Training & development"],
  "Operations & Project Management": ["Agile", "Change management", "Cross functional collaboration", "Implementation", "Operational risk", "Operations management", "Process improvement", "Process management", "Process optimization", "Program management", "Project management", "Property management", "Resource management", "Scheduling", "Scrum", "Site management", "SOP development", "Standard operating procedures", "Stakeholder management", "Strategic planning", "Systems and processes", "Workflow optimization"],
  "Finance & Legal": ["Accounting", "Audit", "Bookkeeping", "Budget management", "Compliance", "Contract management", "Copyright & trademarks", "Corporate development", "Demand planning", "Finance", "Financial reporting", "Forecasting", "Government affairs", "Insurance and claims", "Intellectual property (IP)", "Legal", "Pricing", "Risk management", "Tax", "Treasury"],
  "Tech & Engineering": ["AWS", "Backend development", "Business intelligence", "Coding", "CRM", "CRM management", "CSS", "Cybersecurity", "Data analysis", "Data engineering", "Data modeling", "Data science", "Data warehousing", "Database management", "DevOps", "ERP software", "ETL building", "Figma", "Frontend development", "GraphQL", "HTML", "Information architecture", "IT", "Java", "JavaScript", "Linux", "Machine learning", "Mobile app design", "MySQL", "NetSuite", "Oracle", "PHP", "PLM", "Power BI", "Product management", "Python", "Quality assurance", "React", "Ruby on Rails", "SaaS", "Salesforce", "SAP", "Shopify", "Software development", "SolidWorks", "SQL development", "System administration", "Tableau", "Technology architecture", "Typescript", "Web development", "Wireframing"],
  "Tools & Software": ["Adobe Illustrator", "Adobe Suite", "Airtable", "Asana", "Canva", "Excel", "Google Ads", "Google Analytics", "Google Suite", "Hubspot", "InDesign", "Jira", "Klaviyo", "Lightroom", "Mailchimp", "Microsoft Office", "Miro", "Notion", "Photoshop", "PowerPoint", "Premiere Pro", "Procreate", "Quickbooks", "Salesforce Marketing Cloud", "SharePoint", "Sketchup", "Squarespace", "Trello", "Wordpress", "Zendesk", "Zoom"],
  "Product & Manufacturing": ["Apparel development", "Bill of materials", "Color development", "Costing", "Inventory management", "Manufacturing", "Material sourcing", "Materials testing", "Patternmaking", "Procurement", "Product development", "Product launch", "Production", "Prototyping", "Quality control", "Raw material development", "Regenerative supply development", "Research and development (R&D)", "Sewing", "Sourcing", "Supply chain", "Sustainable design practices", "Technical pack development", "Vendor management", "Wholesale"],
  "Retail & E-commerce": ["Assortment planning", "Buying", "E-commerce", "Merchandising", "Outdoor retail", "Retail design", "Retail management", "Visual merchandising"],
  "Writing Editing & Journalism": ["Blogging", "Climate writing", "Copyediting", "Copywriting", "Editing", "Editorial", "Fact-checking", "Freelance writing", "Ghostwriting", "Journalism", "Longform content", "Proofreading", "Publishing", "Script writing", "SEO copywriting", "Technical writing", "Travel writing", "Writing"],
  "Education & Training": ["Adult learning", "Career coaching", "Classroom management", "Coaching", "Conservation education", "Curriculum development", "Environmental education", "Experiential education", "Instructional design", "Learning design", "LMS", "Outdoor education", "Place-based education", "Public speaking", "Recreational program development", "Teaching", "Trauma-informed work", "Working with adults", "Working with children", "Youth development", "Youth programming"],
  "Outdoor Skills & Activities": ["Adaptive recreation", "Adventure guiding", "Aiare 1 (avalanche cert)", "Avalanche forecasting", "Backcountry guiding", "Backcountry skills", "Backpacking", "Backpacking instructor", "Camping", "Canoeing", "Climbing", "Cross country guiding", "Expedition leading", "Fishing", "Fishing guiding", "Gear testing", "GPS navigation", "Guiding", "Hiking", "Hunting", "Interpretive guiding", "Kayak guiding", "Kayaking", "Leave No Trace", "Mountain bike guiding", "Mountain biking", "Mountaineering", "NAI certified", "Orienteering", "Outdoor adventure", "Outdoor leadership", "Overlanding", "Paddling", "Rafting", "Rock climbing", "Sea kayaking", "Search and rescue", "Skiing", "Ski instructor", "Snowboarding", "Snowboard instructor", "Trail work", "Trip leading", "Whitewater paddling", "Wilderness first aid (WFA)", "Wilderness First Responder (WFR)", "Wilderness guiding", "Wilderness medicine", "Wilderness navigation", "Wilderness skills", "Wilderness travel"],
  "Conservation Science & Sustainability": ["Air and water quality research", "Archaeology", "Biology", "Cartography", "Citizen science", "Climate adaptation", "Conservation", "Earth science", "Ecology", "Environmental engineering", "Environmental policy", "Environmental science", "ESG", "Field research", "Forestry", "Geology", "GIS", "Habitat restoration", "Invasive species removal", "Land stewardship", "Marine biology", "Meteorology", "Native plants", "Natural resource management", "Naturalist", "Nutrition", "Public health", "Sustainability", "Wildlife"],
  "Advocacy Policy & Nonprofit": ["Advocacy", "Coalition building", "Community engagement", "Corporate philanthropy", "Corporate social responsibility", "Fundraising", "Grant writing", "Lobbying", "Nonprofit management", "Policy", "Social impact", "Volunteer management"],
  "Hospitality Tourism & Events": ["Adventure programming", "Event management", "Event marketing", "Event production", "Heritage tourism", "Hospitality", "Hospitality management", "Hotel management", "Nature tourism", "Restaurant management", "Tour operations", "Tourism", "Travel coordination", "Travel planning"],
  "Health Wellness & Recreation": ["Childcare", "Energy work", "Fitness", "Health and wellness", "Massage therapy", "Meditation", "Mental health", "Mindfulness", "Nursing", "Personal trainer", "Wellness", "Yoga", "Yoga instructor"],
  "Field & Manual Work": ["Animal care", "Animal handling", "Camp operations", "Carpentry", "Chainsaw certified", "Construction", "Farming", "Field work", "Gardening", "Horticulture", "Landscaping", "Manual labor", "Outfitting", "Permitting", "Prescribed fire management", "Trip logistics"],
  "Languages": ["Bilingual", "Spanish", "Other (specify)"],
};

export const SKILL_CATEGORY_KEYS = Object.keys(SKILL_CATEGORIES);

// US states + DC + Outside US. Used for current_state and relocation_states.
export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "Outside US",
] as const;

// Major US city → state lookup. Used for cross-matching in the brand location filter
// (e.g. typing "Denver" should also surface candidates open to relocating to "Colorado").
// Kept intentionally short; if no match, the filter falls back to ILIKE substring search.
export const CITY_TO_STATE: Record<string, string> = {
  "denver": "Colorado", "boulder": "Colorado", "fort collins": "Colorado", "colorado springs": "Colorado",
  "portland": "Oregon", "eugene": "Oregon", "bend": "Oregon",
  "seattle": "Washington", "tacoma": "Washington", "spokane": "Washington", "bellingham": "Washington",
  "san francisco": "California", "oakland": "California", "los angeles": "California",
  "san diego": "California", "sacramento": "California", "san jose": "California",
  "new york": "New York", "brooklyn": "New York", "nyc": "New York",
  "boston": "Massachusetts", "cambridge": "Massachusetts",
  "austin": "Texas", "dallas": "Texas", "houston": "Texas", "san antonio": "Texas",
  "chicago": "Illinois", "phoenix": "Arizona", "tucson": "Arizona", "flagstaff": "Arizona",
  "salt lake city": "Utah", "park city": "Utah", "moab": "Utah",
  "atlanta": "Georgia", "miami": "Florida", "tampa": "Florida", "orlando": "Florida",
  "minneapolis": "Minnesota", "saint paul": "Minnesota",
  "detroit": "Michigan", "ann arbor": "Michigan",
  "philadelphia": "Pennsylvania", "pittsburgh": "Pennsylvania",
  "nashville": "Tennessee", "memphis": "Tennessee", "knoxville": "Tennessee",
  "charlotte": "North Carolina", "raleigh": "North Carolina", "asheville": "North Carolina",
  "burlington": "Vermont", "portland maine": "Maine",
  "jackson": "Wyoming", "jackson hole": "Wyoming",
  "missoula": "Montana", "bozeman": "Montana",
  "boise": "Idaho", "ketchum": "Idaho",
  "santa fe": "New Mexico", "albuquerque": "New Mexico", "taos": "New Mexico",
  "las vegas": "Nevada", "reno": "Nevada",
  "washington dc": "District of Columbia", "dc": "District of Columbia",
};

// Hierarchical poachable filter: selecting the looser tier also returns the stricter ones.
export function expandPoachableSelection(selected: string[]): string[] {
  const out = new Set<string>();
  for (const v of selected) {
    out.add(v);
    if (v === "Always open to the right opportunity") out.add("Ready to jump");
  }
  return Array.from(out);
}

// Hierarchical remote filter:
//   "Only seeking remote roles" -> exact only
//   "Open to hybrid"            -> hybrid + Anything goes
//   "Open to in-office"         -> in-office + hybrid + Anything goes
//   "Anything goes"             -> exact only
export function expandRemoteSelection(selected: string[]): string[] {
  const out = new Set<string>();
  for (const v of selected) {
    if (v === "Only seeking remote roles") out.add(v);
    else if (v === "Open to hybrid") { out.add(v); out.add("Anything goes"); }
    else if (v === "Open to in-office") { out.add(v); out.add("Open to hybrid"); out.add("Anything goes"); }
    else if (v === "Anything goes") out.add(v);
    else out.add(v);
  }
  return Array.from(out);
}
