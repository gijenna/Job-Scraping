const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface AttendeeRow {
  field: string;
  normalizedField: string;
  years: string;
  workType: string;
  region: string;
}

function normalizeField(field: string): string {
  if (!field) return 'Other';
  const f = field.toLowerCase().trim();
  
  if (f.includes('marketing') || f.includes('brand') || f.includes('digital marketing')) return 'Marketing & Brand Strategy';
  if (f.includes('creative') || f.includes('design') || f.includes('ui/ux') || f.includes('graphic') || f.includes('industrial') || f.includes('branding')) return 'Creative & Design';
  if (f.includes('communications') || f.includes('pr') || f.includes('public relations') || f.includes('content') || f.includes('social media')) return 'Communications & PR';
  if (f.includes('product') || f.includes('development') || f.includes('merchandise') || f.includes('apparel')) return 'Product Design & Development';
  if (f.includes('sales') || f.includes('partnership') || f.includes('account') || f.includes('retail') || f.includes('e-commerce') || f.includes('ecommerce')) return 'Sales & Partnerships';
  if (f.includes('operations') || f.includes('supply chain') || f.includes('manufacturing') || f.includes('logistics') || f.includes('warehouse')) return 'Operations & Supply Chain';
  if (f.includes('tech') || f.includes('engineering') || f.includes('software') || f.includes('data') || f.includes('ai') || f.includes('it')) return 'Tech & Engineering';
  if (f.includes('science') || f.includes('conservation') || f.includes('sustainability') || f.includes('environment') || f.includes('policy') || f.includes('advocacy')) return 'Science, Conservation & Policy';
  if (f.includes('event') || f.includes('community') || f.includes('nonprofit') || f.includes('non-profit')) return 'Events & Community';
  if (f.includes('education') || f.includes('training') || f.includes('coaching') || f.includes('teaching')) return 'Education & Training';
  if (f.includes('finance') || f.includes('accounting') || f.includes('strategy') || f.includes('innovation') || f.includes('consulting')) return 'Strategy & Finance';
  if (f.includes('human') || f.includes('hr') || f.includes('people') || f.includes('talent') || f.includes('recruiting')) return 'People & HR';
  if (f.includes('photo') || f.includes('video') || f.includes('film') || f.includes('media') || f.includes('journalism')) return 'Media & Production';
  if (f.includes('admin') || f.includes('assistant') || f.includes('executive')) return 'Operations & Supply Chain';
  
  return 'Other';
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeRegion(region: string): string[] {
  if (!region) return [];
  const regions: string[] = [];
  const text = region.toLowerCase();
  
  if (text.includes('colorado') || text.includes('denver') || text.includes('boulder') || text.includes('fort collins')) regions.push('Colorado');
  if (text.includes('mountain west') || text.includes('wy') || text.includes('ut') || text.includes('nm') || text.includes('montana') || text.includes('idaho')) regions.push('Mountain West');
  if (text.includes('west') || text.includes('california') || text.includes('oregon') || text.includes('washington') || text.includes('ca,') || text.includes('or and wa')) regions.push('West Coast');
  if (text.includes('remote')) regions.push('Remote');
  if (text.includes('northeast') || text.includes('new york') || text.includes('dc')) regions.push('Northeast');
  if (text.includes('south') || text.includes('texas') || text.includes('florida')) regions.push('South');
  if (text.includes('midwest') || text.includes('chicago') || text.includes('minnesota')) regions.push('Midwest');
  if (text.includes('abroad') || text.includes('canada') || text.includes('nomad')) regions.push('International');
  
  return regions.length > 0 ? [...new Set(regions)] : ['Other'];
}

function normalizeWorkType(workType: string): string[] {
  if (!workType) return [];
  const types: string[] = [];
  const text = workType.toLowerCase();
  
  if (text.includes('full time')) types.push('Full-Time');
  if (text.includes('part time')) types.push('Part-Time');
  if (text.includes('freelance') || text.includes('consultant') || text.includes('1099')) types.push('Freelance/Contract');
  if (text.includes('seasonal')) types.push('Seasonal');
  if (text.includes('internship')) types.push('Internship');
  
  return types.length > 0 ? types : ['Other'];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const spreadsheetId = '1jMnTsNRQsmx72fv2GPaPkoS7yuh8QESLt1bkv9H3gg0';
    const gid = '1326740402';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    
    console.log('Fetching spreadsheet data...');
    const csvResponse = await fetch(csvUrl);
    if (!csvResponse.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${csvResponse.status}`);
    }
    
    const csvText = await csvResponse.text();
    const lines = csvText.split('\n').filter(l => l.trim());
    
    // Header is line 0 (after the intro text row)
    // Data starts at line 1
    // Column indices (0-based from CSV):
    // Field: column 9 "What is the main field you're interested in"
    // Work type: column 7 "Which types of work do you seek?"
    // Region: column 8 "Where are you seeking work?"
    // Years: column 11 "How many years of experience..."
    
    const attendees: AttendeeRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 12) continue;
      
      const field = cols[9]?.trim();
      const workType = cols[7]?.trim();
      const region = cols[8]?.trim();
      const years = cols[11]?.trim();
      
      // Skip rows without meaningful data
      if (!field && !workType && !region && !years) continue;
      
      attendees.push({ field, normalizedField: normalizeField(field), years, workType, region });
    }
    
    // Build unique filter options
    const fieldSet = new Set<string>();
    const yearsSet = new Set<string>();
    const workTypeSet = new Set<string>();
    const regionSet = new Set<string>();
    
    for (const a of attendees) {
      if (a.normalizedField) fieldSet.add(a.normalizedField);
      if (a.years) yearsSet.add(a.years);
      for (const wt of normalizeWorkType(a.workType)) workTypeSet.add(wt);
      for (const r of normalizeRegion(a.region)) regionSet.add(r);
    }
    
    // Parse filters from request
    const { filters } = await req.json().catch(() => ({ filters: {} }));
    const filterField = filters?.field || null;
    const filterYears = filters?.years || null;
    const filterWorkType = filters?.workType || null;
    const filterRegion = filters?.region || null;
    
    // Apply filters
    let filtered = attendees;
    
    if (filterField) {
      filtered = filtered.filter(a => a.normalizedField === filterField);
    }
    if (filterYears) {
      filtered = filtered.filter(a => a.years === filterYears);
    }
    if (filterWorkType) {
      filtered = filtered.filter(a => normalizeWorkType(a.workType).includes(filterWorkType));
    }
    if (filterRegion) {
      filtered = filtered.filter(a => normalizeRegion(a.region).includes(filterRegion));
    }
    
    const yearsOrder = ['0 years', '1-2 years', '3-5 years', '6-10 years', '11-20 years', '21+ years'];
    const sortedYears = [...yearsSet].sort((a, b) => {
      const ai = yearsOrder.indexOf(a);
      const bi = yearsOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        total: attendees.length,
        filtered: filtered.length,
        options: {
          fields: [...fieldSet].sort(),
          years: sortedYears,
          workTypes: [...workTypeSet].sort(),
          regions: [...regionSet].sort(),
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
