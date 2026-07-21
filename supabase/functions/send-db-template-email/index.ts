// Generic sender that loads an admin-editable template from the email_templates
// table, renders subject/preview/body with variable substitution, converts the
// lightweight markdown body to HTML, wraps it in a branded shell, and enqueues
// to the existing transactional_emails pgmq queue. Failures are logged but
// never block the caller (signup must continue even if email fails).
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE_NAME = "Jenna from Basecamp";
const SENDER_DOMAIN = "notify.basecampoutdoorevents.com";
const FROM_DOMAIN = "basecampoutdoorevents.com";
const REPLY_TO = "jenna@wearetheoutdoorindustry.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function substitute(input: string, vars: Record<string, string>): string {
  return input.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

function renderInline(line: string): string {
  // Process [label](url) and **bold**, escaping otherwise.
  // Tokenize first to avoid escaping URLs/labels twice.
  const parts: string[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) parts.push(escapeHtml(line.slice(last, m.index)));
    if (m[1] !== undefined) {
      const label = escapeHtml(m[1]);
      const url = m[2].trim();
      const safeUrl = /^(https?:|mailto:)/i.test(url) ? url : "https://" + url;
      parts.push(`<a href="${escapeHtml(safeUrl)}" style="color:#ED7660;text-decoration:underline">${label}</a>`);
    } else if (m[3] !== undefined) {
      parts.push(`<strong>${escapeHtml(m[3])}</strong>`);
    }
    last = re.lastIndex;
  }
  if (last < line.length) parts.push(escapeHtml(line.slice(last)));
  return parts.join("");
}

function bodyToHtml(body: string): string {
  // Split into blocks by blank lines. Within a block, consecutive lines starting
  // with "- " become a single <ul>. Otherwise lines join with <br>.
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const out: string[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.every((l) => l.trim().startsWith("- "))) {
      out.push(
        '<ul style="margin:0 0 16px 0;padding-left:20px;color:#19363B;font-size:15px;line-height:1.6">' +
        lines.map((l) => `<li style="margin:4px 0">${renderInline(l.trim().slice(2))}</li>`).join("") +
        "</ul>",
      );
    } else {
      out.push(
        `<p style="margin:0 0 16px 0;color:#19363B;font-size:15px;line-height:1.6">${
          lines.map(renderInline).join("<br>")
        }</p>`,
      );
    }
  }
  return out.join("\n");
}

function shell(htmlBody: string, previewText: string): string {
  const preview = escapeHtml(previewText || "");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Josefin Sans',Arial,sans-serif">
<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">${preview}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff">
  <tr><td align="center" style="padding:32px 16px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#F5E6D3;border-radius:16px;overflow:hidden">
      <tr><td style="background:#19363B;padding:18px 24px"><div style="color:#F5E6D3;font-family:'Josefin Sans',Arial,sans-serif;font-weight:600;letter-spacing:0.04em;font-size:14px;text-transform:uppercase">Basecamp Outdoor</div></td></tr>
      <tr><td style="padding:28px 28px 8px 28px">${htmlBody}</td></tr>
      <tr><td style="padding:8px 28px 28px 28px;border-top:1px solid rgba(25,54,59,0.1);margin-top:16px"><p style="margin:16px 0 0 0;color:#19363B;font-size:11px;line-height:1.5;opacity:0.7">Basecamp Outdoor, Denver, CO. Reply to this email to reach Jenna directly.</p></td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

function bodyToText(body: string, vars: Record<string, string>): string {
  const subbed = substitute(body, vars);
  return subbed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)").replace(/\*\*([^*]+)\*\*/g, "$1");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Auth: only accept calls from server-to-server code that holds the service role key.
  const auth = req.headers.get("authorization") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!serviceKey || !auth.includes(serviceKey)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { template_key, to, variables } = body || {};
  if (!template_key || !to) {
    return new Response(JSON.stringify({ error: "template_key and to are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  const { data: tpl, error: tplErr } = await sb
    .from("email_templates")
    .select("template_key, subject, preview_text, body")
    .eq("template_key", template_key)
    .maybeSingle();

  if (tplErr || !tpl) {
    console.error("template not found", { template_key, error: tplErr });
    return new Response(JSON.stringify({ error: "template not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const vars: Record<string, string> = { ...(variables || {}) };
  const subject = substitute(tpl.subject || "", vars);
  const previewText = substitute(tpl.preview_text || "", vars);
  const renderedBody = substitute(tpl.body || "", vars);
  const html = shell(bodyToHtml(renderedBody), previewText);
  const text = bodyToText(tpl.body || "", vars);
  const messageId = crypto.randomUUID();
  const idempotencyKey = (variables && variables.idempotency_key) || messageId;

  // Suppression check: never send to suppressed addresses.
  const normalizedEmail = String(to).toLowerCase();
  const { data: suppressed } = await sb
    .from("suppressed_emails")
    .select("email")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (suppressed) {
    await sb.from("email_send_log").insert({
      message_id: messageId, template_name: template_key, recipient_email: to,
      status: "suppressed", error_message: "Recipient on suppression list",
    });
    return new Response(JSON.stringify({ ok: false, reason: "suppressed" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Get or create unsubscribe token (one per email address). Required by the
  // Lovable Email API for transactional emails.
  let unsubscribeToken: string | null = null;
  const { data: existingToken } = await sb
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token;
  } else if (!existingToken) {
    const newToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0")).join("");
    await sb.from("email_unsubscribe_tokens").upsert(
      { token: newToken, email: normalizedEmail },
      { onConflict: "email", ignoreDuplicates: true },
    );
    const { data: stored } = await sb
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalizedEmail)
      .maybeSingle();
    unsubscribeToken = stored?.token || newToken;
  } else {
    // Token used (unsubscribed) but missing from suppression list. Skip send.
    await sb.from("email_send_log").insert({
      message_id: messageId, template_name: template_key, recipient_email: to,
      status: "suppressed", error_message: "Unsubscribe token already used",
    });
    return new Response(JSON.stringify({ ok: false, reason: "unsubscribed" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  await sb.from("email_send_log").insert({
    message_id: messageId, template_name: template_key, recipient_email: to, status: "pending",
  });

  const { error: enqueueError } = await sb.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      reply_to: REPLY_TO,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label: template_key,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueError) {
    await sb.from("email_send_log").insert({
      message_id: messageId, template_name: template_key, recipient_email: to,
      status: "failed", error_message: enqueueError.message || "enqueue failed",
    });
    return new Response(JSON.stringify({ ok: false, error: "enqueue failed" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true, queued: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
