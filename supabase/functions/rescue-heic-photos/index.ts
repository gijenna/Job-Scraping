// One-off rescue: convert existing HEIC/HEIF candidate photos to JPEG.
// Requires the caller to pass header `x-admin-key` matching SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import convert from "npm:heic-convert@2.1.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // Gate: caller must be the admin Supabase Auth user.
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const adminEmail = (Deno.env.get("ADMIN_EMAIL") || "").toLowerCase();
  if (!token || !adminEmail) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
  const { data: userData } = await authClient.auth.getUser(token);
  if (!userData?.user?.email || userData.user.email.toLowerCase() !== adminEmail) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: rows, error } = await sb
    .from("candidates")
    .select("id, photo_url")
    .or("photo_url.ilike.%.heic%,photo_url.ilike.%.heif%");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const results: any[] = [];
  for (const row of rows || []) {
    try {
      const marker = "/candidate-photos/";
      const url: string = row.photo_url;
      if (!url.includes(marker)) {
        results.push({ id: row.id, skipped: "not in candidate-photos bucket" });
        continue;
      }
      const oldPath = url.split(marker)[1].split("?")[0];
      if (!/\.(heic|heif)$/i.test(oldPath)) {
        results.push({ id: row.id, skipped: "not heic" });
        continue;
      }

      // Download original.
      const { data: blob, error: dlErr } = await sb.storage.from("candidate-photos").download(oldPath);
      if (dlErr || !blob) throw new Error(`download failed: ${dlErr?.message}`);
      const inputBuf = new Uint8Array(await blob.arrayBuffer());

      // Convert HEIC → JPEG.
      const jpegBuf: Uint8Array = await convert({ buffer: inputBuf, format: "JPEG", quality: 0.9 });

      const newPath = oldPath.replace(/\.(heic|heif)$/i, ".jpg");
      const { error: upErr } = await sb.storage
        .from("candidate-photos")
        .upload(newPath, jpegBuf, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw new Error(`upload failed: ${upErr.message}`);

      // Sign fresh URL (7 days, matches existing storage pattern).
      const { data: signed, error: signErr } = await sb.storage
        .from("candidate-photos").createSignedUrl(newPath, 60 * 60 * 24 * 7);
      if (signErr || !signed) throw new Error(`sign failed: ${signErr?.message}`);

      const { error: updErr } = await sb.from("candidates")
        .update({ photo_url: signed.signedUrl }).eq("id", row.id);
      if (updErr) throw new Error(`db update failed: ${updErr.message}`);

      // Best-effort cleanup of original.
      await sb.storage.from("candidate-photos").remove([oldPath]).catch(() => {});

      results.push({ id: row.id, converted: true, oldPath, newPath });
    } catch (e: any) {
      results.push({ id: row.id, error: e.message });
    }
  }

  return new Response(JSON.stringify({ count: results.length, results }, null, 2), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
