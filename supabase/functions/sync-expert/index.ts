import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Sheets JWT auth using service account
async function getGoogleAccessToken(serviceAccount: any): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const headerB64 = encode(header);
  const claimB64 = encode(claim);
  const unsignedToken = `${headerB64}.${claimB64}`;

  // Import the private key
  const pemContent = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${unsignedToken}.${sigB64}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Google token error: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const expert = await req.json();
    const results: Record<string, any> = {};

    // --- Folk CRM sync ---
    const folkApiKey = Deno.env.get('FOLK_API_KEY');
    if (folkApiKey) {
      try {
        // Find the "Industry Experts" group
        let groupId: string | null = null;
        const groupsRes = await fetch('https://api.folk.app/v1/groups?limit=100', {
          headers: { 'Authorization': `Bearer ${folkApiKey}` },
        });
        const groupsData = await groupsRes.json();
        const targetGroup = (groupsData.data?.items || []).find(
          (g: any) => g.name.toLowerCase() === 'industry experts'
        );
        if (targetGroup) {
          groupId = targetGroup.id;
          console.log('Found Folk group "Industry Experts":', groupId);
        } else {
          console.warn('Folk group "Industry Experts" not found. Available groups:', 
            (groupsData.data?.items || []).map((g: any) => g.name));
        }

        // Search for existing person by email first
        let folkPersonId: string | null = null;
        if (expert.email) {
          const searchRes = await fetch(
            `https://api.folk.app/v1/people?q=${encodeURIComponent(expert.email)}`,
            { headers: { 'Authorization': `Bearer ${folkApiKey}` } }
          );
          const searchData = await searchRes.json();
          if (searchData.data?.length > 0) {
            folkPersonId = searchData.data[0].id;
          }
        }

        const nameParts = (expert.full_name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const folkPayload: any = {
          firstName,
          lastName,
          emails: expert.email ? [expert.email] : [],
          ...(expert.job_title && { jobTitle: expert.job_title }),
          ...(expert.linkedin_url && { urls: [expert.linkedin_url] }),
          ...(groupId && { groups: [{ id: groupId }] }),
        };

        if (folkPersonId) {
          // Update existing
          const updateRes = await fetch(`https://api.folk.app/v1/people/${folkPersonId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${folkApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(folkPayload),
          });
          results.folk = { status: updateRes.status, action: 'updated', id: folkPersonId, groupId };
        } else {
          // Create new
          const createRes = await fetch('https://api.folk.app/v1/people', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${folkApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(folkPayload),
          });
          const createData = await createRes.json();
          results.folk = { status: createRes.status, action: 'created', data: createData, groupId };
        }
      } catch (folkErr: any) {
        console.error('Folk sync error:', folkErr);
        results.folk = { error: folkErr.message };
      }
    }

    // --- Google Sheets sync ---
    // Brand reps go to a dedicated brand-reps sheet/tab; everyone else to the city sheet.
    const serviceAccountKeyStr = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    const citySlug = (expert.city_slug || '').toLowerCase();
    const isBrandRep = expert.is_brand_rep === true || expert.expert_type === 'brand_rep';
    const brandRepsSheetId = Deno.env.get('GOOGLE_SPREADSHEET_ID_BRAND_REPS');
    const sheetIdMap: Record<string, string | undefined> = {
      denver: Deno.env.get('GOOGLE_SPREADSHEET_ID_DENVER'),
      portland: Deno.env.get('GOOGLE_SPREADSHEET_ID_PORTLAND'),
    };
    const spreadsheetId = isBrandRep
      ? brandRepsSheetId
      : (sheetIdMap[citySlug] || Deno.env.get('GOOGLE_SPREADSHEET_ID'));
    const sheetTabName = isBrandRep ? 'Brand Reps ' : 'Sheet1';
    if (serviceAccountKeyStr && spreadsheetId) {
      try {
        let serviceAccount: any;
        // Strip BOM, surrounding whitespace, and surrounding quotes
        let raw = serviceAccountKeyStr.trim().replace(/^\uFEFF/, '');
        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
          raw = raw.slice(1, -1);
        }
        // Find the JSON object boundaries
        const firstBrace = raw.indexOf('{');
        const lastBrace = raw.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          raw = raw.slice(firstBrace, lastBrace + 1);
        }
        try {
          serviceAccount = JSON.parse(raw);
        } catch (e1) {
          try {
            serviceAccount = JSON.parse(atob(serviceAccountKeyStr.trim()));
          } catch (e2) {
            throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY. First chars: ${serviceAccountKeyStr.slice(0, 30)} | length: ${serviceAccountKeyStr.length} | json err: ${e1.message}`);
          }
        }
        // Fix escaped newlines in private_key if needed
        if (serviceAccount.private_key && !serviceAccount.private_key.includes('\n')) {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        console.log('Service account parsed, client_email:', serviceAccount.client_email || 'MISSING');
        const accessToken = await getGoogleAccessToken(serviceAccount);

        const row = [
          new Date().toISOString(),
          expert.full_name || '',
          expert.email || '',
          expert.job_title || '',
          expert.current_company || '',
          expert.field_of_work || '',
          expert.linkedin_url || '',
          expert.city_slug || '',
          expert.expert_type || '',
          expert.status || '',
          (expert.niche_interests || []).join(', '),
          expert.years_in_industry || '',
          expert.years_in_city || '',
          expert.ask_me_about || '',
        ];

        const appendRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTabName + '!A1')}:append?valueInputOption=USER_ENTERED`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ values: [row] }),
          }
        );

        const appendData = await appendRes.json();
        results.sheets = { status: appendRes.status, spreadsheetId, city: citySlug, tab: sheetTabName, data: appendData };
      } catch (sheetsErr: any) {
        console.error('Google Sheets sync error:', sheetsErr);
        results.sheets = { error: sheetsErr.message };
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Sync error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
