import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local without requiring dotenv
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  const key = trimmed.slice(0, idx).trim()
  let value = trimmed.slice(idx + 1).trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  process.env[key] = value
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  const { error } = await supabase.from('events').upsert(
    {
      title:                      'LLM Bootcamp 1.0',
      slug:                       'llm-bootcamp-1',
      description:                'From tokens to tools in a single day, go from using ChatGPT to building with LLMs. A hands on bootcamp covering GPT, Claude, and Gemini, ending with two real AI products you will build yourself.',
      date:                       '2026-06-21T21:30:00+05:00',
      registration_deadline:      '2026-06-21T15:00:00+05:00',
      type:                       'workshop',
      brand:                      'skillsync',
      is_paid:                    true,
      price:                      100,
      is_published:               true,
      registration_open:          true,
      is_online:                  true,
      external_registration_url:  'https://docs.google.com/forms/d/e/1FAIpQLSdBN93l5DL7cWEETEZgiO6ZRwOmeOF0r4qiOMCfCXq2O_nZ2w/viewform?usp=header',
      hide_seats_display:         true,
      tools_covered:              ['GPT', 'Claude', 'Gemini', 'LLMs'],
      form_schema:                [],
    },
    { onConflict: 'slug' }
  )

  if (error) {
    console.error('Insert failed:', error.message)
    process.exit(1)
  }

  console.log('LLM Bootcamp event seeded successfully.')
}

main()
