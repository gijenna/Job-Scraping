const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Admin-only: LinkedIn scraping burns paid Firecrawl credits.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const { data: userData } = await userClient.auth.getUser();
    const email = userData?.user?.email?.toLowerCase() || '';
    if (!email.endsWith('@wearetheoutdoorindustry.com')) {
      return new Response(JSON.stringify({ success: false, error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scraping LinkedIn URL:', formattedUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown', 'links'],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to extract LinkedIn profile data from markdown
    const markdown = data.data?.markdown || data.markdown || '';
    const metadata = data.data?.metadata || data.metadata || {};

    // Parse what we can from the markdown content
    const extracted: Record<string, string | null> = {
      name: null,
      headline: null,
      company: null,
      photoUrl: null,
      location: null,
    };

    // Try to get name from metadata title (usually "FirstName LastName - Title | LinkedIn")
    if (metadata.title) {
      const titleParts = metadata.title.split(' - ');
      if (titleParts.length > 0) {
        extracted.name = titleParts[0].trim();
      }
      if (titleParts.length > 1) {
        const headlinePart = titleParts[1].replace(' | LinkedIn', '').trim();
        extracted.headline = headlinePart;
      }
    }

    // Try OG image for photo
    if (metadata.ogImage) {
      extracted.photoUrl = metadata.ogImage;
    }

    // Try to parse headline for company
    if (extracted.headline) {
      const atMatch = extracted.headline.match(/(?:at|@)\s+(.+)/i);
      if (atMatch) {
        extracted.company = atMatch[1].trim();
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: extracted, 
        raw: { markdown: markdown.substring(0, 2000), metadata } 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
