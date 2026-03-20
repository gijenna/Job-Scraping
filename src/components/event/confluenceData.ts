export interface StateOffice {
  name: string;
  abbr: string;
  officeName: string;
  yearJoined: number;
  website: string;
  director?: string;
  directorPhoto?: string;
  directorLinkedin?: string;
  economicImpact?: string;
  jobs?: string;
}

export const memberStates: StateOffice[] = [
  // 2018 Founding
  { name: "Colorado", abbr: "CO", officeName: "Colorado Outdoor Recreation Industry Office", yearJoined: 2018, website: "https://oedit.colorado.gov/outdoor-recreation-industry-office", director: "Nathan Fey", economicImpact: "$62.5B", jobs: "511,000" },
  { name: "Montana", abbr: "MT", officeName: "Montana Office of Outdoor Recreation", yearJoined: 2018, website: "https://commerce.mt.gov/Outdoor-Recreation", director: "Rachel VandeVoort", economicImpact: "$7.1B", jobs: "71,000" },
  { name: "North Carolina", abbr: "NC", officeName: "North Carolina Office of Outdoor Recreation", yearJoined: 2018, website: "https://www.commerce.nc.gov/outdoor-recreation", director: "Aaron Whitehead", economicImpact: "$28B", jobs: "260,000" },
  { name: "Oregon", abbr: "OR", officeName: "Oregon Office of Outdoor Recreation", yearJoined: 2018, website: "https://www.oregon.gov/orec", director: "Jeff Kish", economicImpact: "$15.6B", jobs: "172,000" },
  { name: "Utah", abbr: "UT", officeName: "Utah Office of Outdoor Recreation", yearJoined: 2018, website: "https://business.utah.gov/outdoor", director: "Pitt Grewe", economicImpact: "$6.4B", jobs: "110,000" },
  { name: "Vermont", abbr: "VT", officeName: "Vermont Outdoor Recreation Economic Collaborative", yearJoined: 2018, website: "https://fpr.vermont.gov/VOREC", director: "Michael Snyder", economicImpact: "$5.8B", jobs: "36,000" },
  { name: "Washington", abbr: "WA", officeName: "Washington Recreation & Conservation Office", yearJoined: 2018, website: "https://rco.wa.gov/", director: "Megan Dunn", economicImpact: "$26.2B", jobs: "267,000" },
  { name: "Wyoming", abbr: "WY", officeName: "Wyoming Office of Outdoor Recreation", yearJoined: 2018, website: "https://www.wyoming.gov/outdoor-recreation", director: "Domenic Bravo", economicImpact: "$6.1B", jobs: "50,000" },
  // 2019
  { name: "Maine", abbr: "ME", officeName: "Maine Office of Outdoor Recreation", yearJoined: 2019, website: "https://www.maine.gov/dacf/parks/outdoor_recreation_office/", director: "Carolann Ouellette", economicImpact: "$8.2B", jobs: "76,000" },
  { name: "Michigan", abbr: "MI", officeName: "Michigan Office of Outdoor Recreation Industry", yearJoined: 2019, website: "https://www.michigan.gov/leo/bureaus-agencies/oori", director: "Brad Garmon", economicImpact: "$26.6B", jobs: "232,000" },
  { name: "New Mexico", abbr: "NM", officeName: "New Mexico Outdoor Recreation Division", yearJoined: 2019, website: "https://www.nmoutside.com/", director: "Axie Navas", economicImpact: "$9.9B", jobs: "99,000" },
  { name: "Virginia", abbr: "VA", officeName: "Virginia Office of Outdoor Recreation", yearJoined: 2019, website: "https://www.governor.virginia.gov/outdoor-recreation/", economicImpact: "$29.1B", jobs: "197,000" },
  // 2022
  { name: "Arkansas", abbr: "AR", officeName: "Arkansas Office of Outdoor Recreation", yearJoined: 2022, website: "https://www.arkansas.com/outdoor-recreation", economicImpact: "$4.2B", jobs: "63,000" },
  { name: "Maryland", abbr: "MD", officeName: "Maryland Office of Outdoor Recreation", yearJoined: 2022, website: "https://commerce.maryland.gov/outdoorrecreation", economicImpact: "$14.4B", jobs: "120,000" },
  { name: "New Hampshire", abbr: "NH", officeName: "New Hampshire Office of Outdoor Recreation Industry Development", yearJoined: 2022, website: "https://www.nheconomy.com/outdoor-recreation", economicImpact: "$4.8B", jobs: "44,000" },
  // 2024
  { name: "Massachusetts", abbr: "MA", officeName: "Massachusetts Office of Outdoor Recreation", yearJoined: 2024, website: "https://www.mass.gov/outdoor-recreation", economicImpact: "$20.1B", jobs: "148,000" },
  { name: "Pennsylvania", abbr: "PA", officeName: "Pennsylvania Office of Outdoor Recreation", yearJoined: 2024, website: "https://dced.pa.gov/outdoor-recreation/", economicImpact: "$29.1B", jobs: "251,000" },
  { name: "Minnesota", abbr: "MN", officeName: "Minnesota Office of Outdoor Recreation", yearJoined: 2024, website: "https://mn.gov/deed/outdoor-recreation/", director: "Dan McGowan", economicImpact: "$11.7B", jobs: "120,000" },
  { name: "North Dakota", abbr: "ND", officeName: "North Dakota Outdoor Recreation Office", yearJoined: 2024, website: "https://www.commerce.nd.gov/", economicImpact: "$2.2B", jobs: "23,000" },
  // 2025
  { name: "Wisconsin", abbr: "WI", officeName: "Wisconsin Office of Outdoor Recreation", yearJoined: 2025, website: "https://wedc.org/outdoor-recreation/", economicImpact: "$12.7B", jobs: "134,000" },
];

export const memberAbbrs = new Set(memberStates.map(s => s.abbr));

export function getStateOffice(abbr: string): StateOffice | undefined {
  return memberStates.find(s => s.abbr === abbr);
}
