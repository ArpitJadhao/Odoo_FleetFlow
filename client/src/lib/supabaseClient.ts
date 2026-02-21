import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Debug — remove after confirming env vars load correctly
console.log('[Supabase] URL:', supabaseUrl || '❌ MISSING')
console.log('[Supabase] Key:', supabaseAnonKey ? '✅ present' : '❌ MISSING')

if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_ID')) {
    console.error(
        '[Supabase] VITE_SUPABASE_URL is missing or still a placeholder.\n' +
        'Create G:\\void\\Odoo\\client\\.env with your real Supabase URL.'
    )
}

if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_ANON_KEY')) {
    console.error(
        '[Supabase] VITE_SUPABASE_ANON_KEY is missing or still a placeholder.\n' +
        'Create G:\\void\\Odoo\\client\\.env with your real Supabase anon key.'
    )
}

export const supabase = createClient(
    supabaseUrl ?? 'https://placeholder.supabase.co',
    supabaseAnonKey ?? 'placeholder'
)
