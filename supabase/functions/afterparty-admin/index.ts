// Admin dispatcher: locks/unlocks matches, deletes attendees, sends emails, reviews suggestions.
// Caller must be authenticated with an approved admin email/domain.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAIL') || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
const ADMIN_DOMAINS = ['wearetheoutdoorindustry.com']
const AFTERPARTY_EVENT_SLUG = 'afterparty'
const EXTRA_NICHES_SETTING_KEY = 'afterparty.extra_niches'

interface MatchRow {
  attendee_id: string
  match_attendee_id: string
  rank: number | null
  reasons: string[] | null
  score: number
  locked: boolean
  is_mutual_boost?: boolean
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'unauthorized' }, 401)

    // Verify caller via anon client + their token
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData.user?.email) return json({ error: 'unauthorized' }, 401)

    const callerEmail = userData.user.email.trim().toLowerCase()
    const callerDomain = callerEmail.split('@').pop() || ''
    const isApprovedAdmin = ADMIN_EMAILS.includes(callerEmail) || ADMIN_DOMAINS.includes(callerDomain)

    if (!isApprovedAdmin) {
      return json({ error: 'forbidden' }, 403)
    }

    const body = await req.json()
    const action = String(body?.action || '')
    const payload = body?.payload || {}

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    let result: unknown = { ok: true }

    switch (action) {
      case 'lock_matches': {
        const matches = (payload.matches || []) as MatchRow[]
        await admin.from('afterparty_matches').delete().eq('locked', true)
        if (matches.length) {
          const rows = matches.map((m) => ({
            attendee_id: m.attendee_id,
            match_attendee_id: m.match_attendee_id,
            rank: m.rank,
            reasons: m.reasons,
            score: m.score,
            locked: true,
            is_mutual_boost: m.is_mutual_boost ?? false,
          }))
          const { error } = await admin.from('afterparty_matches').insert(rows)
          if (error) return json({ error: error.message }, 500)
        }
        result = { ok: true, count: matches.length }
        break
      }
      case 'unlock_matches': {
        await admin.from('afterparty_matches').delete().eq('locked', true)
        break
      }
      case 'delete_attendee': {
        const id = String(payload.id || '')
        if (!id) return json({ error: 'missing id' }, 400)
        await admin.from('afterparty_attendees').delete().eq('id', id)
        break
      }
      case 'send_match_emails': {
        const { data, error } = await admin.functions.invoke('send-afterparty-matches', { body: {} })
        if (error) return json({ error: error.message }, 500)
        result = data
        break
      }
      case 'review_suggestion': {
        const id = String(payload.id || '')
        const status = String(payload.status || '')
        if (!id || !['approved', 'rejected'].includes(status)) {
          return json({ error: 'bad payload' }, 400)
        }
        const { data: suggestion, error: fetchError } = await admin.from('afterparty_suggestions')
          .select('kind')
          .eq('id', id)
          .maybeSingle()
        if (fetchError) return json({ error: fetchError.message }, 500)

        const { error: updateError } = await admin.from('afterparty_suggestions')
          .update({ status, reviewed_at: new Date().toISOString() })
          .eq('id', id)
        if (updateError) return json({ error: updateError.message }, 500)

        if (suggestion?.kind === 'niche') {
          const { data: approved, error: approvedError } = await admin.from('afterparty_suggestions')
            .select('value, reviewed_at, created_at')
            .eq('kind', 'niche')
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
          if (approvedError) return json({ error: approvedError.message }, 500)

          const byLower = new Map<string, string>()
          for (const row of approved || []) {
            const value = String(row.value || '').trim()
            if (value && !byLower.has(value.toLowerCase())) byLower.set(value.toLowerCase(), value)
          }
          const settingValue = Array.from(byLower.values()).sort((a, b) => a.localeCompare(b)).join(', ')
          const { error: upsertError } = await admin.from('event_settings').upsert({
            event_slug: AFTERPARTY_EVENT_SLUG,
            setting_key: EXTRA_NICHES_SETTING_KEY,
            setting_value: settingValue,
          }, { onConflict: 'event_slug,setting_key' })
          if (upsertError) return json({ error: upsertError.message }, 500)
        }
        break
      }
      case 'list_suggestions': {
        const { data, error } = await admin.from('afterparty_suggestions')
          .select('*').eq('status', 'pending').order('created_at', { ascending: false })
        if (error) return json({ error: error.message }, 500)
        result = { suggestions: data || [] }
        break
      }
      default:
        return json({ error: 'unknown action' }, 400)
    }

    // Audit log
    await admin.from('admin_action_log').insert({
      actor_email: callerEmail,
      action,
      payload: payload as Record<string, unknown>,
    })

    return json(result, 200)
  } catch (e) {
    console.error('afterparty-admin error', e)
    return json({ error: 'server_error' }, 500)
  }
})

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
