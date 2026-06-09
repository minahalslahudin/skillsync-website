import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local without requiring dotenv
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

const WORKSHOP = 'n8n Workshop 1.0 by skillSYNC'

const reviews = [
  {
    reviewer_name: 'Maham Anjum',
    reviewer_role: 'AI Student, FAST\'28',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'From setting up n8n from scratch to building workflows with REST APIs, Google Sheets, databases, and code nodes, this was one of the most practical learning experiences I have had. Creating workflows manually instead of following tutorials made every concept actually stick. The workshop was beginner friendly, well structured, and packed with real world applications.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: true,
    photo_url: null,
  },
  {
    reviewer_name: 'Abdul Wasay Shahan',
    reviewer_role: 'CS Student, NUCES',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'The eight hour hands on session was focused entirely on practical workflow building, moving beyond theory into actually designing automations end to end. What I appreciated most was learning how automation connects real systems to solve real problems. Big thanks to Minahal Salahudin for being such a capable and patient instructor.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Humna Sadia',
    reviewer_role: 'Software Developer, FAST NUCES \'27',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'Two days, seven workflows, and a completely new skill set. We went from installation all the way to HTTP requests, REST APIs, Google Forms, MySQL databases, JavaScript code nodes, and merge nodes with no long tutorials and no hand holding. The learning curve was real but that is exactly what made it stick. The workshop was fast paced but never felt directionless.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: true,
    photo_url: null,
  },
  {
    reviewer_name: 'Muhammad Khizar',
    reviewer_role: 'CS Student, NUCES',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'This workshop covered in ten hours what any institute would take months to teach. We went from the basics of what n8n even is all the way to writing JavaScript, running MySQL queries, and building practical automation workflows with real outputs. I am genuinely grateful for the opportunity to learn this much in such a short time.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Romaisa',
    reviewer_role: 'BS AI Student, FAST\'28',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'There were bugs along the way but that is exactly what made the experience real. I went from installing the tool to building actual workflows with SMTP, HTTP requests, REST APIs, Google Sheets, databases, and code nodes in a single day. What stood out most was how quickly confidence builds when you actually build something instead of just watching.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Ali Ather',
    reviewer_role: 'Automation Learner',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'In eight hours I actively built and completed seven workflows by skipping lengthy tutorials and relying on trial and error. Working with SMTP, HTTP, Google Forms, Google Sheets, REST APIs, databases, and custom code nodes made the experience intense but genuinely fulfilling. I feel ready to take on real world automation projects independently.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: true,
    photo_url: null,
  },
  {
    reviewer_name: 'Fakeha Kashf',
    reviewer_role: 'BSCS Student',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'A month ago my biggest automation was a Google Form that sent a confirmation email. After this workshop I had built seven workflows from scratch including webhook to email pipelines, weather API updates, MySQL tracking, and product price monitoring. Nothing worked on the first try and that is exactly why it all made sense by the end.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Zaid Rizwan',
    reviewer_role: 'AI Automation Developer',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'skillSYNC is building something different by creating a community of people who learn by doing. In seven to eight hours I went from zero to having real confidence with n8n, covering installation through SMTP, HTTP, Google Forms, REST APIs, databases, and code nodes. There is a confidence that only comes from building the thing yourself and not watching someone else build it.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: true,
    photo_url: null,
  },
  {
    reviewer_name: 'Saliha Adan',
    reviewer_role: 'Workshop Attendee',
    workshop_or_service: WORKSHOP,
    rating: 4,
    body: 'The workshop felt well paced and by the end I could build a complete n8n workflow on my own. I honestly could not think of anything I would change about how it was designed or delivered. I have already started recommending it to everyone I know.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Umair Hassan',
    reviewer_role: 'Workshop Attendee',
    workshop_or_service: WORKSHOP,
    rating: 4,
    body: 'The workshop helped me understand the basics of n8n clearly and I can now confidently build workflows from scratch to solve real problems. I would recommend it to others because it is genuinely useful and easy to follow even for beginners.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Mashal Zahra',
    reviewer_role: 'Workshop Attendee',
    workshop_or_service: WORKSHOP,
    rating: 4,
    body: 'Each session built naturally on the previous one which made the overall structure feel logical and manageable. I now feel confident enough to build n8n workflows from scratch and automate real tasks like form submissions and email triggers. I would absolutely recommend this to anyone looking to get into automation without needing deep technical knowledge.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Ali Ather',
    reviewer_role: 'Automation Learner',
    workshop_or_service: WORKSHOP,
    rating: 4,
    body: 'The sessions felt well paced in terms of teaching each workflow individually. I can now confidently build n8n workflows using online resources as the foundation has been properly laid. I would recommend this workshop to others and think smaller groups per instructor would make the experience even stronger.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Muhammad Fahad Amjad',
    reviewer_role: 'Workshop Attendee',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'Each workflow built on the previous one which made the learning curve feel smooth rather than overwhelming. After completing all seven workflows I feel genuinely confident enough to build automation from scratch for real use cases. I would absolutely recommend this workshop to anyone interested in automation as it delivers real hands on experience with actual working workflows.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Rohma Jamil',
    reviewer_role: 'CS Student, NUCES',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'I went from not knowing what n8n was to building workflows with SMTP, HTTP requests, Google Forms, Sheets, Google Cloud, REST APIs, databases, and code nodes by actually doing them myself. There were moments of confusion but figuring things out yourself and then watching that workflow actually run is something else entirely. The structure and energy of the skillSYNC team made the whole experience worth it.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: true,
    photo_url: null,
  },
  {
    reviewer_name: 'Hajira Gul',
    reviewer_role: 'AI Student, FAST',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'The hands on approach made every concept land in a way that watching tutorials never could. Working through real workflows with actual integrations and live debugging sessions gave me the kind of confidence that only comes from building things yourself. The skillSYNC team created an environment that was both challenging and genuinely supportive.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Sara Mehmood',
    reviewer_role: 'Workshop Attendee',
    workshop_or_service: WORKSHOP,
    rating: 4,
    body: 'I came in with no background in automation and left with the ability to build working n8n workflows from scratch. The way the content was structured made even the complex parts approachable. This is the kind of practical learning that is difficult to find anywhere else.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Ahmed Raza',
    reviewer_role: 'Computer Science Student',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'The workshop covered more practical ground in two days than most online courses cover in weeks. Every concept was immediately applied to a real workflow which meant nothing felt abstract or theoretical. I walked away with skills I can actually use in projects right now.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Noor Fatima',
    reviewer_role: 'Tech Learner',
    workshop_or_service: WORKSHOP,
    rating: 4,
    body: 'What made this workshop different was that the instructors never just showed you how to do something and moved on. You had to figure parts of it out yourself which was frustrating in the moment but made everything stick much better. I would recommend it to anyone serious about learning automation properly.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
  {
    reviewer_name: 'Bilal Tariq',
    reviewer_role: 'BSCS Student',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'Starting from a basic setup and ending with seven complete working automations in under two days was something I did not expect to be possible. The workshop covered APIs, databases, conditionals, email automation, and custom code nodes in a way that felt connected rather than scattered. The skillSYNC team clearly put real thought into how this should be taught.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: true,
    photo_url: null,
  },
  {
    reviewer_name: 'Eman Khalid',
    reviewer_role: 'Automation Enthusiast',
    workshop_or_service: WORKSHOP,
    rating: 5,
    body: 'I had tried learning n8n on my own before and kept getting stuck without understanding why things were failing. This workshop gave me the mental model I was missing so that when things broke I actually knew how to debug them. Completing real workflows from scratch changed how I think about building systems.',
    brand: 'skillsync',
    is_approved: true,
    is_featured: false,
    photo_url: null,
  },
]

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing env vars. Got:')
    console.error('  NEXT_PUBLIC_SUPABASE_URL:', url ? url.slice(0, 40) + '...' : '(missing)')
    console.error('  SUPABASE_SERVICE_ROLE_KEY:', key ? key.slice(0, 20) + '...' : '(missing)')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  console.log('\nConnecting to Supabase...')
  console.log('URL:', url)

  const { data, error } = await supabase
    .from('reviews')
    .insert(reviews)
    .select('id, reviewer_name, rating, is_featured')

  if (error) {
    console.error('Insert failed:', error.message)
    process.exit(1)
  }

  console.log(`\nInserted ${data.length} reviews:`)
  for (const row of data) {
    console.log(`  [${row.id}]  ${row.reviewer_name}  (${row.rating} stars${row.is_featured ? ', featured' : ''})`)
  }
  console.log('\nDone.')
}

main()
