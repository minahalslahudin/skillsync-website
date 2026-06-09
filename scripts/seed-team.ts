import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const foundKeys: string[] = []
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
  foundKeys.push(key)
}
console.log('Loaded keys from .env.local:', foundKeys)

type DbRole = 'Volunteer' | 'Intern' | 'Lead' | 'C-Suite' | 'Admin'

const teamData: {
  name: string
  email: string
  displayRole: string
  dbRole: DbRole
  department: string
  bio: string
  image_url: string
  is_public: boolean
  order: number
}[] = [
  {
    name: 'Minahal Salahudin',
    email: 'minahal@team.skillsync.internal',
    displayRole: 'Founder & Strategic Lead',
    dbRole: 'C-Suite',
    department: 'Leadership',
    bio: 'BS CyberSec | Automation Engineer at Trillies AI | Built Finora AI (Google Hackathon) | Organized Promptopia | Lead multiple technical societies | Full-stack, ML/LLMs, LangGraph',
    image_url: '/team/minahal-salahudin.jpg',
    is_public: true,
    order: 1,
  },
  {
    name: 'Amani Jumaloon',
    email: 'amani@team.skillsync.internal',
    displayRole: 'Technical & Curriculum Lead',
    dbRole: 'Lead',
    department: 'Technology',
    bio: 'BS CyberSec | AI/ML & Automation | Full-Stack Dev | Built EVOX — full-stack society management web app',
    image_url: '/team/amani-jumaloon.jpg',
    is_public: true,
    order: 2,
  },
  {
    name: 'Fatima Hayat',
    email: 'fatima@team.skillsync.internal',
    displayRole: 'Hardware & Robotics Lead',
    dbRole: 'Lead',
    department: 'Technology',
    bio: 'Mechatronics Eng. at NUST | Director Aero at NERC | Drones, PCBs, LFRs — enables future robotics and IoT workshops',
    image_url: '/team/fatima-hayat.jpg',
    is_public: true,
    order: 3,
  },
  {
    name: 'Burhan Aslam',
    email: 'burhan@team.skillsync.internal',
    displayRole: 'Trainer & Operations',
    dbRole: 'Lead',
    department: 'Operations',
    bio: 'BS Software Engineering | VP FAST LADS | Automation & Agentic AI Specialist | International client experience | Multiple Pakistan software houses',
    image_url: '/team/burhan-aslam.png',
    is_public: true,
    order: 4,
  },
  {
    name: 'Zaid Rizwan',
    email: 'zaid@team.skillsync.internal',
    displayRole: 'Growth & Strategy',
    dbRole: 'Lead',
    department: 'Growth',
    bio: 'BS Business Analytics | Automation Specialist | Intern at Prudential Solutions | Power BI, SQL, n8n, Make.com | Atomcamp Ambassador at FAST-NUCES',
    image_url: '/team/zaid-rizwan.jpg',
    is_public: true,
    order: 5,
  },
  {
    name: 'Muskan Ahmad Sheikh',
    email: 'muskan@team.skillsync.internal',
    displayRole: 'Outreach & Project Lead',
    dbRole: 'Lead',
    department: 'Operations',
    bio: 'BS FinTech | AI Dev & QA at ADEPT Inc | Built Enterprise HRMS & DeepDefense (Voice Phishing Detection with Deep Learning)',
    image_url: '/team/muskan-ahmad.jpg',
    is_public: true,
    order: 6,
  },
  {
    name: 'Saliha Adan',
    email: 'saliha@team.skillsync.internal',
    displayRole: 'Workshop Facilitator',
    dbRole: 'Lead',
    department: 'Technology',
    bio: 'BS FSE | FAST AI Society | Built AIMI — Emotional Support Pet Robot | Built Emergency DSS (663K+ record MongoDB Atlas dataset)',
    image_url: '/team/saliha-adan.jpg',
    is_public: true,
    order: 7,
  },
]

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing env vars.')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  console.log('\nConnecting to Supabase...')
  console.log('URL:', url)

  // List existing auth users so we can look up by email
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 200 })
  if (listError) {
    console.error('Failed to list auth users:', listError.message)
    process.exit(1)
  }
  const existingByEmail = new Map(listData.users.map(u => [u.email, u.id]))

  let inserted = 0
  let updated = 0

  for (const member of teamData) {
    process.stdout.write(`\nProcessing: ${member.name}...`)

    // Step 1: Create or find auth user
    let userId: string
    if (existingByEmail.has(member.email)) {
      userId = existingByEmail.get(member.email)!
      process.stdout.write(' (auth user exists)')
    } else {
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: member.email,
        email_confirm: true,
        user_metadata: {
          full_name: member.name,
          avatar_url: member.image_url,
        },
      })
      if (createError) {
        console.error(`\n  Failed to create auth user for ${member.name}:`, createError.message)
        process.exit(1)
      }
      userId = createData.user.id
      process.stdout.write(' (auth user created)')
    }

    // Step 2: Update public.users (trigger already inserted the row on auth user creation)
    const { error: userError } = await supabase
      .from('users')
      .update({
        full_name: member.name,
        role: member.dbRole,
        department: member.department,
        bio: member.bio,
        avatar_url: member.image_url,
      })
      .eq('id', userId)

    if (userError) {
      console.error(`\n  Failed to update public.users for ${member.name}:`, userError.message)
      process.exit(1)
    }

    // Step 3: Upsert team_members
    const { data: tmData, error: tmError } = await supabase
      .from('team_members')
      .upsert(
        {
          user_id: userId,
          is_public: member.is_public,
          display_order: member.order,
          custom_title: member.displayRole,
        },
        { onConflict: 'user_id' }
      )
      .select('id')

    if (tmError) {
      console.error(`\n  Failed to upsert team_members for ${member.name}:`, tmError.message)
      process.exit(1)
    }

    const wasInserted = !existingByEmail.has(member.email)
    if (wasInserted) inserted++; else updated++

    console.log(`\n  ${wasInserted ? '+' : '~'} [order ${member.order}] ${member.name} — ${member.displayRole}`)
  }

  console.log(`\nDone. ${inserted} created, ${updated} updated. ${teamData.length} total members seeded.`)
}

main()
