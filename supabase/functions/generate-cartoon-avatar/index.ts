import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { attendee_id, photo_url } = await req.json();

    if (!photo_url) {
      return new Response(
        JSON.stringify({ error: "photo_url required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Generate cartoon via Lovable AI image edit
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Convert this portrait into a bold modern flat-design portrait illustration in the style of editorial magazine spot illustrations. Limited color palette (3-4 colors max), geometric simplified shapes, NO outlines, confident flat color blocks with subtle shading planes. Head and shoulders, centered on a solid colored background (deep teal, mustard, terracotta, or dusty pink). Keep these features recognizable and accurate: hair color and style, skin tone, glasses, facial hair, clothing color. Sophisticated, designer-y, editorial. Do NOT add outlines, do NOT make it 3D, do NOT make it photorealistic, do NOT make it cute or cartoony.",
              },
              { type: "image_url", image_url: { url: photo_url } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Out of AI credits" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      throw new Error(`AI gateway returned ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    const dataUrl: string | undefined = aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl) throw new Error("No image returned from AI");

    // Decode base64 → Uint8Array
    const base64 = dataUrl.split(",")[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // Upload to storage
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const path = `afterparty/cartoon-${attendee_id || "anon"}-${Date.now()}.png`;
    const { error: upErr } = await supabase.storage
      .from("event-photos")
      .upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) throw upErr;

    const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
    const cartoonUrl = urlData.publicUrl;

    // Persist to attendee row only if id provided
    if (attendee_id) {
      const { error: updErr } = await supabase
        .from("afterparty_attendees")
        .update({ cartoon_url: cartoonUrl })
        .eq("id", attendee_id);
      if (updErr) throw updErr;
    }

    return new Response(JSON.stringify({ cartoon_url: cartoonUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cartoon-avatar error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
