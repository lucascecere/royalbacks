import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, hasLoyalty } from '@/src/lib/env'

/**
 * Service-role Supabase client. Bypasses RLS, so it must never reach a client
 * bundle — the `server-only` import above turns that into a build error.
 */
let client: SupabaseClient | null = null

export function db(): SupabaseClient {
  if (!hasLoyalty) {
    throw new Error(
      'Loyalty is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and a ' +
        'SESSION_SECRET of at least 32 characters.'
    )
  }
  if (!client) {
    client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { 'X-Client-Info': 'royal-backs-loyalty' } },
    })
  }
  return client
}

/** Emails are the join key between accounts, Shopify orders and the ledger. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
