// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import satori from "https://esm.sh/satori@0.10.13";
import { Resvg, initWasm } from "https://esm.sh/@resvg/resvg-wasm@2.6.2";
import React from "https://esm.sh/react@18.3.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---------- one-shot cold start setup ----------
let wasmReady: Promise<void> | null = null;
async function ensureResvg() {
  if (!wasmReady) {
    wasmReady = (async () => {
      const wasm = await fetch("https://esm.sh/@resvg/resvg-wasm@2.6.2/index_bg.wasm").then(r => r.arrayBuffer());
      await initWasm(wasm);
    })();
  }
  await wasmReady;
}

const fontCache: Record<string, ArrayBuffer> = {};
async function loadFont(url: string): Promise<ArrayBuffer> {
  if (fontCache[url]) return fontCache[url];
  const buf = await fetch(url).then(r => r.arrayBuffer());
  fontCache[url] = buf;
  return buf;
}

// Josefin Sans (Google Fonts static TTF mirror via jsdelivr for reliability)
const FONT_URLS = {
  regular: "https://cdn.jsdelivr.net/gh/googlefonts/josefinsans@main/fonts/ttf/JosefinSans-Regular.ttf",
  medium:  "https://cdn.jsdelivr.net/gh/googlefonts/josefinsans@main/fonts/ttf/JosefinSans-Medium.ttf",
  semibold:"https://cdn.jsdelivr.net/gh/googlefonts/josefinsans@main/fonts/ttf/JosefinSans-SemiBold.ttf",
  bold:    "https://cdn.jsdelivr.net/gh/googlefonts/josefinsans@main/fonts/ttf/JosefinSans-Bold.ttf",
  boldItalic:"https://cdn.jsdelivr.net/gh/googlefonts/josefinsans@main/fonts/ttf/JosefinSans-BoldItalic.ttf",
};

async function getFonts() {
  const [r, m, s, b, bi] = await Promise.all([
    loadFont(FONT_URLS.regular),
    loadFont(FONT_URLS.medium),
    loadFont(FONT_URLS.semibold),
    loadFont(FONT_URLS.bold),
    loadFont(FONT_URLS.boldItalic),
  ]);
  return [
    { name: "Josefin Sans", data: r,  weight: 400, style: "normal" as const },
    { name: "Josefin Sans", data: m,  weight: 500, style: "normal" as const },
    { name: "Josefin Sans", data: s,  weight: 600, style: "normal" as const },
    { name: "Josefin Sans", data: b,  weight: 700, style: "normal" as const },
    { name: "Josefin Sans", data: bi, weight: 700, style: "italic" as const },
  ];
}

// Lockup asset. Fetched from private bucket via service-role.
let lockupDataUrl: string | null = null;
async function getLockupDataUrl(supabase: any): Promise<string | null> {
  if (lockupDataUrl) return lockupDataUrl;
  const { data, error } = await supabase.storage.from("share-assets").download("gather_lockup.png");
  if (error || !data) { console.warn("lockup not found in share-assets:", error?.message); return null; }
  const buf = new Uint8Array(await data.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 8192) bin += String.fromCharCode(...buf.subarray(i, i + 8192));
  lockupDataUrl = `data:image/png;base64,${btoa(bin)}`;
  return lockupDataUrl;
}

// ---------- helpers ----------
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") || "image/jpeg";
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf.byteLength < 100) return null;
    let bin = "";
    for (let i = 0; i < buf.length; i += 8192) bin += String.fromCharCode(...buf.subarray(i, i + 8192));
    return `data:${ct};base64,${btoa(bin)}`;
  } catch { return null; }
}

const CHIP_COLORS = ["#E8836B","#5B8266","#C4A24A","#7A5C8F","#3D6B7A","#B9564F","#4E7A5C","#8A6D3B"];
function chipColor(seed: string): string {
  let h = 0; for (const c of seed) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  return CHIP_COLORS[Math.abs(h) % CHIP_COLORS.length];
}
function initials(name: string, max = 2): string {
  return name.split(/\s+/).filter(Boolean).slice(0, max).map(w => w[0]?.toUpperCase() || "").join("");
}

function truncateAskMeAbout(raw?: string | null): string | null {
  if (!raw) return null;
  const t = raw.trim();
  if (!t) return null;
  if (t.length <= 60) return t;
  const prefix = t.slice(0, 60);
  const lastDot = prefix.lastIndexOf(".");
  if (lastDot > 0) return prefix.slice(0, lastDot + 1) + "…";
  // fallback: last word boundary
  const boundary = Math.max(prefix.lastIndexOf(" "), prefix.lastIndexOf(","), prefix.lastIndexOf("-"));
  const cut = boundary > 0 ? prefix.slice(0, boundary) : prefix;
  return cut.replace(/[.,\-\s]+$/,"") + "…";
}

// ---------- layout ----------
type Fmt = "og" | "ig_portrait" | "ig_story";
const DIMS: Record<Fmt, { w: number; h: number }> = {
  og: { w: 1200, h: 630 },
  ig_portrait: { w: 1080, h: 1350 },
  ig_story: { w: 1080, h: 1920 },
};

interface Expert {
  full_name: string;
  photo_url: string | null;
  job_title: string | null;
  current_company: string | null;
  previous_companies: string | null;
  field_of_work: string | null;
  ask_me_about: string | null;
  linkedin_url: string | null;
}

function h(type: any, props: any = {}, ...children: any[]) {
  return React.createElement(type, props, ...children.flat().filter(c => c != null && c !== false));
}

function buildCard(expert: Expert, photoDataUrl: string, cardWidth: number, opts: { tilted: boolean }) {
  const scale = cardWidth / 388;
  const inner = (v: number) => Math.round(v * scale);
  const ama = truncateAskMeAbout(expert.ask_me_about);
  const prevList = (expert.previous_companies || "")
    .split(",").map(s => s.trim()).filter(Boolean).slice(0, 4);
  const currColor = chipColor(expert.current_company || expert.full_name);

  const cardHeight = inner(758);

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: cardWidth,
      height: cardHeight,
      background: "#243530",
      borderRadius: inner(7),
      padding: inner(16),
      position: "relative",
      transform: opts.tilted ? "rotate(-5deg)" : "none",
      transformOrigin: "top left",
      boxShadow: opts.tilted ? `${inner(9)}px ${inner(9)}px 0 rgba(0,0,0,0.55)` : "none",
      fontFamily: "Josefin Sans",
    },
  },
    // Polaroid frame
    h("div", {
      style: {
        display: "flex", position: "relative",
        width: inner(317), height: inner(317),
        background: "#F2E7D5", borderRadius: inner(2),
      },
    },
      h("img", { src: photoDataUrl, width: inner(282), height: inner(282), style: {
        position: "absolute", top: inner(17), left: inner(17), objectFit: "cover",
      }}),
      // LinkedIn badge
      expert.linkedin_url ? h("div", { style: {
        position: "absolute", right: inner(9), bottom: inner(9),
        width: inner(32), height: inner(32), borderRadius: inner(16),
        background: "#2D77B5", color: "#fff", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: inner(14), fontWeight: 700, fontStyle: "italic",
      }}, "in") : null,
    ),
    // Name
    h("div", { style: {
      marginTop: inner(24), color: "#E8836B",
      fontSize: inner(28), fontWeight: 700, lineHeight: 1.1, display: "flex",
    }}, expert.full_name),
    // Title + company
    (expert.job_title || expert.current_company) ? h("div", { style: {
      display: "flex", alignItems: "center", marginTop: inner(8),
      color: "#E5C566", fontSize: inner(19), fontWeight: 500,
    }},
      h("span", {}, expert.job_title || ""),
      expert.current_company ? h("span", { style: { display: "flex", alignItems: "center", marginLeft: inner(6) }},
        h("span", { style: { margin: `0 ${inner(6)}px` }}, "·"),
        h("div", { style: {
          width: inner(22), height: inner(22), borderRadius: inner(11),
          background: currColor, color: "#fff", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: inner(11), fontWeight: 700, marginRight: inner(6),
        }}, initials(expert.current_company, 1)),
        h("span", {}, expert.current_company),
      ) : null,
    ) : null,
    // Previously
    prevList.length ? h("div", { style: {
      display: "flex", alignItems: "center", marginTop: inner(10),
      color: "#A8B5A0", fontSize: inner(16), fontWeight: 500,
    }},
      h("span", { style: { marginRight: inner(8) }}, "Previously:"),
      ...prevList.map(c => h("div", { style: {
        width: inner(20), height: inner(20), borderRadius: inner(10),
        background: chipColor(c), color: "#fff", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: inner(10), fontWeight: 700, marginRight: inner(4),
      }}, initials(c, 2))),
    ) : null,
    // Field pill
    expert.field_of_work ? h("div", { style: {
      display: "flex", marginTop: inner(12),
      background: "#E8836B", color: "#4A1B0C", borderRadius: inner(14),
      padding: `${inner(4)}px ${inner(14)}px`, fontSize: inner(16), fontWeight: 700,
      alignSelf: "flex-start",
    }}, expert.field_of_work) : null,
    // AMA
    ama ? h("div", { style: {
      display: "flex", flexDirection: "column", marginTop: inner(24),
    }},
      h("div", { style: {
        color: "#E8836B", fontSize: inner(16), fontWeight: 600,
        letterSpacing: inner(2.4) / 10, textTransform: "uppercase",
      }}, "Ask me about"),
      h("div", { style: {
        color: "#F2E7D5", fontSize: inner(21), fontStyle: "italic",
        marginTop: inner(6), lineHeight: 1.25,
      }}, ama),
    ) : null,
    // More info affordance
    h("div", { style: {
      color: "#A8B5A0", fontSize: inner(19), fontWeight: 500,
      marginTop: "auto",
    }}, "More info ⌄"),
  );
}

function buildOg(expert: Expert, photoDataUrl: string, lockup: string | null) {
  const { w, h: H } = DIMS.og;
  return h("div", {
    style: {
      width: w, height: H, background: "#0A0F0C",
      display: "flex", position: "relative", fontFamily: "Josefin Sans",
      overflow: "hidden",
    }
  },
    // Coral banner (drawn before card so card overlaps it)
    h("div", { style: {
      position: "absolute", left: 0, top: 593, width: w, height: 78,
      background: "#E8836B", display: "flex",
    }}),
    // Banner CTA — centered in the clear area right of the tilted card
    h("div", { style: {
      position: "absolute", top: 620, left: 500, width: 700, height: 40,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#1A2520", fontSize: 28, fontWeight: 700,
    }}, "Free. No badge needed. No gatekeepers."),
    // Lockup
    lockup ? h("img", { src: lockup, width: 343, height: 67, style: {
      position: "absolute", top: 39, left: 825, objectFit: "contain",
    }}) : h("div", { style: {
      position: "absolute", top: 39, left: 825, width: 343, height: 67,
      color: "#F2E7D5", fontSize: 28, fontWeight: 700, display: "flex",
      alignItems: "center", justifyContent: "flex-end",
    }}, "basecamp × OR"),
    // OR GATHERINGS tag
    h("div", { style: {
      position: "absolute", top: 132, left: 500, width: 668, height: 20,
      display: "flex", justifyContent: "flex-end", alignItems: "center",
      color: "#9B9D8C", fontSize: 16, fontWeight: 600, letterSpacing: 3.6,
    }}, "OR GATHERINGS"),
    // Hook column
    h("div", { style: {
      position: "absolute", left: 500, top: 220, width: 668,
      display: "flex", flexDirection: "column",
    }},
      h("div", { style: { color: "#F2E7D5", fontSize: 56, fontWeight: 400, lineHeight: 1.05 }}, "Skip the cold email."),
      h("div", { style: { color: "#F4D03F", fontSize: 106, fontWeight: 700, fontStyle: "italic", lineHeight: 1.0, marginTop: 6 }}, "Just show up."),
      h("div", { style: { color: "#D5CDB7", fontSize: 23, fontWeight: 400, marginTop: 24, lineHeight: 1.3 }}, "Networking hours with the people who built this industry."),
    ),
    // Card (tilted, bleeds bottom) — positioned so its top-left corner is (4,39)
    h("div", { style: {
      position: "absolute", left: 4, top: 39, display: "flex",
    }},
      buildCard(expert, photoDataUrl, 388, { tilted: true }),
    ),
  );
}

function buildVertical(expert: Expert, photoDataUrl: string, lockup: string | null, fmt: "ig_portrait" | "ig_story") {
  const { w, h: H } = DIMS[fmt];
  const isStory = fmt === "ig_story";
  const cardW = isStory ? 640 : 540;
  const cardX = (w - cardW) / 2;
  const cardY = isStory ? 440 : 200;
  const lockupY = isStory ? 280 : 60;
  const kickerY = isStory ? 395 : 175;
  const hookTopY = isStory ? 1270 : 870;
  const hookBigY = isStory ? 1380 : 970;
  const netY = isStory ? 1470 : 1050;
  const bannerY = isStory ? 1580 : 1250;

  return h("div", {
    style: { width: w, height: H, background: "#0A0F0C", position: "relative", display: "flex", fontFamily: "Josefin Sans", overflow: "hidden" }
  },
    lockup ? h("img", { src: lockup, width: 400, height: 78, style: {
      position: "absolute", top: lockupY, left: (w - 400) / 2, objectFit: "contain",
    }}) : null,
    h("div", { style: {
      position: "absolute", top: kickerY, left: 0, width: w,
      display: "flex", justifyContent: "center", color: "#F2E7D5",
      fontSize: 18, fontWeight: 600, letterSpacing: 3.6,
    }}, "INDUSTRY EXPERTS · OR GATHERINGS"),
    h("div", { style: {
      position: "absolute", left: cardX, top: cardY, display: "flex",
    }}, buildCard(expert, photoDataUrl, cardW, { tilted: false })),
    h("div", { style: {
      position: "absolute", left: 0, top: hookTopY, width: w,
      display: "flex", justifyContent: "center", color: "#F2E7D5",
      fontSize: isStory ? 52 : 48, fontWeight: 400,
    }}, "Skip the cold email."),
    h("div", { style: {
      position: "absolute", left: 0, top: hookBigY, width: w,
      display: "flex", justifyContent: "center", color: "#F4D03F",
      fontSize: isStory ? 108 : 96, fontWeight: 700, fontStyle: "italic",
    }}, "Just show up."),
    h("div", { style: {
      position: "absolute", left: (w - 900)/2, top: netY, width: 900,
      display: "flex", justifyContent: "center", textAlign: "center",
      color: "#D5CDB7", fontSize: isStory ? 24 : 22, fontWeight: 400,
    }}, "Networking hours with the people who built this industry."),
    h("div", { style: {
      position: "absolute", left: 0, top: bannerY, width: w, height: 100,
      background: "#E8836B", display: "flex", alignItems: "center", justifyContent: "center",
      color: "#1A2520", fontSize: isStory ? 32 : 32, fontWeight: 700,
    }}, "Free. No badge needed. No gatekeepers."),
  );
}

// ---------- handler ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const fnIdx = parts.lastIndexOf("expert-card-image");
  const expertSlug = decodeURIComponent(parts[fnIdx + 1] || "");
  const eventSlug = decodeURIComponent(parts[fnIdx + 2] || "");
  const fmt = (url.searchParams.get("format") || "og") as Fmt;
  const download = url.searchParams.get("download") === "1";

  if (!expertSlug || eventSlug !== "minneapolis") {
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
  if (!DIMS[fmt]) {
    return new Response("Invalid format", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: expert, error: expErr } = await supabase
    .from("industry_experts")
    .select("id, full_name, photo_url, job_title, current_company, previous_companies, field_of_work, ask_me_about, linkedin_url, slug")
    .eq("slug", expertSlug)
    .single();
  if (expErr || !expert) return new Response("Expert not found", { status: 404, headers: corsHeaders });

  const { data: assignment } = await supabase
    .from("expert_city_assignments")
    .select("id, published")
    .eq("expert_id", expert.id)
    .eq("city_slug", "minneapolis")
    .maybeSingle();
  if (!assignment) return new Response("Not assigned to minneapolis", { status: 404, headers: corsHeaders });

  if (!expert.photo_url) {
    return new Response(JSON.stringify({ error: "missing_photo", message: "Expert card cannot render without a photo." }), {
      status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const [photo, lockup, fonts] = await Promise.all([
      fetchImageAsDataUrl(expert.photo_url),
      getLockupDataUrl(supabase),
      getFonts(),
    ]);
    if (!photo) {
      return new Response(JSON.stringify({ error: "missing_photo", message: "Expert photo unreachable." }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const tree = fmt === "og"
      ? buildOg(expert as Expert, photo, lockup)
      : buildVertical(expert as Expert, photo, lockup, fmt);

    const { w, h: H } = DIMS[fmt];
    const svg = await satori(tree as any, { width: w, height: H, fonts: fonts as any });

    await ensureResvg();
    const png = new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng();

    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "image/png");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    if (download) headers.set("Content-Disposition", `attachment; filename="${expertSlug}-${fmt}.png"`);
    return new Response(png, { headers });
  } catch (err: any) {
    console.error("render error:", err?.message, err?.stack);
    return new Response(JSON.stringify({ error: "render_failed", message: err?.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
