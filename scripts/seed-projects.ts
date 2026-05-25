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
  // Strip surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  process.env[key] = value
  foundKeys.push(key)
}
console.log('Loaded keys from .env.local:', foundKeys)

const projects = [
  {
    title: 'LeadSYNC AI',
    tagline: 'From form submission to personalized reply in under 10 seconds',
    slug: 'leadsync-ai',
    tool: 'Make.com',
    industry: 'Sales, Marketing, SaaS, Agencies',
    builder_name: 'Burhan Aslam',
    builder_role: 'Automation Specialist',
    project_type: 'automation',
    problem_statement:
      'Most businesses handle inbound leads manually — reading messages, writing replies, adding contacts to CRMs, notifying the team. This takes hours. During that window, the lead goes cold. LeadSYNC AI eliminates every manual step in that process.',
    how_it_works: [
      { title: 'Webhook Trigger',    description: 'Fires instantly the moment a prospect submits a contact form — no polling delay' },
      { title: 'CRM Logging',        description: 'Lead data is immediately written to Airtable — name, email, company, message' },
      { title: 'AI Scoring',         description: 'GPT-4o reads the lead details and returns a quality score (1–10) with reasoning' },
      { title: 'Personalized Email', description: 'GPT-4o writes a unique reply referencing the lead\'s industry, company size, and pain point — sent via Gmail' },
      { title: 'Smart Routing',      description: 'Router splits flow: score 7+ gets an urgent Slack alert, lower scores get a standard notification' },
      { title: 'Error Handling',     description: '5 dedicated error handlers — if anything fails, team gets an instant Slack alert in #errors' },
    ],
    key_features: [
      { title: 'AI Personalization',              description: 'Every lead gets a unique email written by GPT-4o — not a template. It references their specific industry and pain point.' },
      { title: 'Intelligent Lead Scoring',        description: 'Each lead is scored 1–10 with written reasoning. High-value leads are flagged for immediate follow-up.' },
      { title: 'Conditional Routing',             description: 'Business logic inside automation — high and low priority leads are handled differently, automatically.' },
      { title: 'Error Handling on Every Module',  description: '5 error handlers protect the workflow. No lead is ever silently lost.' },
      { title: 'Real-Time Trigger',               description: 'Entire pipeline completes within 10 seconds of form submission. Works 24/7.' },
    ],
    results: [
      'Lead response time reduced from hours to under 10 seconds',
      '100% of leads receive a personalized reply — even outside business hours',
      'Sales team notified instantly with a scored, pre-analysed lead summary',
      'CRM updated automatically — zero manual data entry',
      'Workflow runs 24/7 with no human intervention',
    ],
    tech_stack: [
      { tool: 'Make.com',        role: 'Visual workflow engine' },
      { tool: 'OpenAI GPT-4o',   role: 'Lead scoring and email personalization' },
      { tool: 'Airtable',        role: 'CRM and lead database' },
      { tool: 'Gmail',           role: 'Sending personalized replies' },
      { tool: 'Slack',           role: 'Team alerts and error notifications' },
      { tool: 'Webhooks',        role: 'Real-time form submission trigger' },
    ],
    time_saved:   '3–4 hours per day on lead handling',
    money_saved:  'Replaces a full-time SDR for early-stage teams',
    is_published: true,
    sort_order:   1,
    description:  'Most businesses handle inbound leads manually — reading messages, writing replies, adding contacts to CRMs, notifying the team. This takes hours. During that window, the lead goes cold. LeadSYNC AI eliminates every manual step in that process.',
    brand:        'skillIT',
    is_ongoing:   false,
    image_urls:   [],
    tech_tags:    ['Make.com', 'OpenAI GPT-4o', 'Airtable', 'Gmail', 'Slack'],
  },

  {
    title: 'Auto Recruiting Bot',
    tagline: 'From CV submitted to interview booked — zero human involvement',
    slug: 'auto-recruiting-bot',
    tool: 'n8n',
    industry: 'HR, Talent Acquisition, Startups',
    builder_name: 'Minahal Salahudin',
    builder_role: 'Automation Engineer and Trainer',
    project_type: 'automation',
    problem_statement:
      'Hiring teams read every CV manually, write individual emails, and track candidates in messy spreadsheets. Strong candidates wait days for a response. The team spends more time managing applications than evaluating talent.',
    how_it_works: [
      { title: 'Form Polling',         description: 'Google Forms polled every 30 minutes for new SWE and BDM applications' },
      { title: 'Normalization',         description: 'Inconsistent field names from both forms mapped to a unified structure. Ghost rows and empty submissions filtered.' },
      { title: 'Duplicate Detection',   description: 'Every candidate checked against master sheet and current batch — no duplicate processing' },
      { title: 'Resume Download',       description: 'Drive URLs converted to direct download links and files fetched via OAuth' },
      { title: 'AI Screening',          description: 'Groq (LLaMA) evaluates each CV with a role-specific prompt — returns score, classification, strengths, and concerns' },
      { title: 'Master Sheet Update',   description: 'Full candidate record written to Google Sheets with AI results and status set to pending_email' },
      { title: 'Email Dispatch',        description: 'Separate hourly workflow reads pending candidates and sends interview invites, hiring manager alerts, or rejection emails' },
      { title: 'Calendar Booking',      description: 'Strong candidates automatically receive a Google Calendar interview invite' },
    ],
    key_features: [
      { title: 'Two Decoupled Workflows',    description: 'Processing and emailing are split. If AI fails mid-run, no emails are sent for partially processed candidates.' },
      { title: 'Role-Specific AI Evaluation', description: 'SWE prompt evaluates technical depth and system design. BDM prompt evaluates revenue numbers and sales methodology.' },
      { title: '3-Way Classification',       description: 'Strong candidates get interview invites. Average candidates trigger a hiring manager review. Weak candidates receive a warm rejection.' },
      { title: 'Automatic Calendar Booking', description: 'Strong candidates receive a Google Calendar event with them added as attendee — no scheduling back-and-forth.' },
      { title: 'Duplicate Protection',       description: 'Handles same-batch duplicates and resubmissions — no candidate is ever processed twice.' },
    ],
    results: [
      'Full screening pipeline runs automatically every 30 minutes',
      'Interview invites sent and calendar booked without any human action',
      'Hiring manager only sees pre-scored, pre-summarised strong candidates',
      'Zero duplicate processing regardless of resubmissions',
      'Works simultaneously for two completely different job roles',
    ],
    tech_stack: [
      { tool: 'n8n',                  role: 'Workflow engine' },
      { tool: 'Groq + LLaMA 3',       role: 'AI resume evaluation' },
      { tool: 'Google Sheets',        role: 'Application tracking and master database' },
      { tool: 'Google Drive',         role: 'Resume file storage' },
      { tool: 'Gmail',                role: 'Candidate and hiring manager emails' },
      { tool: 'Google Calendar',      role: 'Automatic interview scheduling' },
    ],
    time_saved:   '5–8 hours per hiring cycle',
    money_saved:  'Eliminates need for a dedicated HR coordinator for early screening',
    is_published: true,
    sort_order:   2,
    description:  'Hiring teams read every CV manually, write individual emails, and track candidates in messy spreadsheets. Strong candidates wait days for a response. The team spends more time managing applications than evaluating talent.',
    brand:        'skillIT',
    is_ongoing:   false,
    image_urls:   [],
    tech_tags:    ['n8n', 'Groq', 'LLaMA 3', 'Google Sheets', 'Gmail', 'Google Calendar'],
  },

  {
    title: 'WhatsApp Support Bot',
    tagline: 'Instant AI replies for customers, smart escalation for your team',
    slug: 'whatsapp-support-bot',
    tool: 'n8n',
    industry: 'E-commerce, Retail, SMBs',
    builder_name: 'Minahal Salahudin',
    builder_role: 'Automation Engineer and Trainer',
    project_type: 'automation',
    problem_statement:
      'Small businesses cannot staff a support team 24/7. Customers message on WhatsApp and wait hours for replies. Urgent issues like returns and complaints get buried in a stream of routine questions.',
    how_it_works: [
      { title: 'Message Received',  description: 'Customer sends a WhatsApp message — bot receives it instantly via webhook' },
      { title: 'AI Reply',          description: 'AI reads the message against the business context and generates a relevant, accurate reply' },
      { title: 'Intent Detection',  description: 'System detects if the message contains urgent intent — return requests, complaints, broken items' },
      { title: 'Auto Reply',        description: 'Routine queries get an instant AI response — no human needed' },
      { title: 'Manager Alert',     description: 'Urgent messages trigger an immediate Discord or Slack alert to the manager with the full message' },
    ],
    key_features: [
      { title: 'Context-Aware AI Replies', description: 'Bot answers based on your actual business information — not generic responses.' },
      { title: 'Urgency Detection',        description: 'Returns, complaints, and broken item reports are flagged and escalated instantly.' },
      { title: 'Manager Alerts',           description: 'Urgent messages hit Discord or Slack immediately — manager never misses a critical issue.' },
      { title: '24/7 Operation',           description: 'Customers get instant replies at any hour without any human staffing.' },
    ],
    results: [
      '100% of routine queries answered instantly without human involvement',
      'Urgent issues escalated to manager in under 30 seconds',
      'Support coverage extended to 24/7 with no additional staffing cost',
      'Manager only handles escalations — not routine questions',
    ],
    tech_stack: [
      { tool: 'n8n',                     role: 'Workflow engine' },
      { tool: 'WhatsApp Business API',   role: 'Message trigger and reply' },
      { tool: 'OpenAI / AI Chatbot',     role: 'Context-aware reply generation' },
      { tool: 'Discord / Slack',         role: 'Manager escalation alerts' },
    ],
    time_saved:   '2–3 hours per day on routine support queries',
    money_saved:  'Replaces need for a dedicated support agent for routine queries',
    is_published: true,
    sort_order:   3,
    description:  'Small businesses cannot staff a support team 24/7. Customers message on WhatsApp and wait hours for replies. Urgent issues like returns and complaints get buried in a stream of routine questions.',
    brand:        'skillIT',
    is_ongoing:   false,
    image_urls:   [],
    tech_tags:    ['n8n', 'WhatsApp Business API', 'OpenAI', 'Discord', 'Slack'],
  },

  {
    title: 'CV Screener + Notion Talent Board',
    tagline: 'Every CV scored, summarised, and tracked — before you read a single one',
    slug: 'cv-screener-talent-board',
    tool: 'n8n',
    industry: 'HR, Recruitment, Agencies',
    builder_name: 'Minahal Salahudin',
    builder_role: 'Automation Engineer and Trainer',
    project_type: 'automation',
    problem_statement:
      'Recruiters read hundreds of CVs manually, write notes in separate docs, and lose track of strong candidates. Time-sensitive roles miss great applicants because nobody noticed an 8/10 application arrive at 2am.',
    how_it_works: [
      { title: 'CV Received',      description: 'Any form submission triggers the workflow via webhook — works with any form tool' },
      { title: 'AI Extraction',    description: 'AI reads the CV and extracts name, experience, skills, and relevant background' },
      { title: 'Scoring',          description: 'Candidate receives a match score for the applied role with written strengths and weaknesses' },
      { title: 'Notion Entry',     description: 'Full candidate profile created on the Notion Talent Board with all fields populated' },
      { title: 'Manager Alert',    description: 'If score is 8 or above, manager receives an instant alert — focus only on the best fits' },
    ],
    key_features: [
      { title: 'AI Match Scoring',        description: 'Every candidate scored against the job role — not just keyword matched.' },
      { title: 'Strengths and Weaknesses', description: 'AI writes a short analysis of what the candidate does well and where they fall short.' },
      { title: 'Notion Talent Board',     description: 'Manager sees a live board with all applicants, scores, and summaries at a glance.' },
      { title: 'Best Fit Alerts',         description: 'Score 8+ triggers an immediate manager alert — no strong candidate goes unnoticed.' },
    ],
    results: [
      'Every CV screened and scored automatically — zero manual reading required',
      'Manager only reviews pre-scored summaries, not raw CVs',
      'Strong candidates flagged instantly regardless of when they apply',
      'Complete talent pipeline visible on Notion in real time',
    ],
    tech_stack: [
      { tool: 'n8n',            role: 'Workflow engine' },
      { tool: 'OpenAI',         role: 'CV extraction and scoring' },
      { tool: 'Notion API',     role: 'Talent board and candidate tracking' },
      { tool: 'Webhooks',       role: 'Form submission trigger' },
      { tool: 'Slack / Discord', role: 'Manager alerts' },
    ],
    time_saved:   '4–6 hours per hiring round',
    money_saved:  'Eliminates manual screening cost for early-stage filtering',
    is_published: true,
    sort_order:   4,
    description:  'Recruiters read hundreds of CVs manually, write notes in separate docs, and lose track of strong candidates. Time-sensitive roles miss great applicants because nobody noticed an 8/10 application arrive at 2am.',
    brand:        'skillIT',
    is_ongoing:   false,
    image_urls:   [],
    tech_tags:    ['n8n', 'OpenAI', 'Notion API', 'Webhooks', 'Slack'],
  },

  {
    title: 'AI Digest Bot',
    tagline: 'Your industry, summarised and delivered every morning',
    slug: 'ai-digest-bot',
    tool: 'n8n',
    industry: 'Media, Research, Agencies, Any knowledge-based business',
    builder_name: 'Minahal Salahudin',
    builder_role: 'Automation Engineer and Trainer',
    project_type: 'automation',
    problem_statement:
      'Staying informed requires reading dozens of articles daily across multiple sources. Teams either spend hours on this or stay uninformed. Important industry developments get missed.',
    how_it_works: [
      { title: 'Scheduled Trigger',  description: 'Workflow fires every morning at a set time automatically' },
      { title: 'News Collection',    description: 'NewsAPI fetches latest articles for a specific topic or industry' },
      { title: 'AI Summarisation',   description: 'AI reads each article and generates a concise summary' },
      { title: 'Top 5 Selection',    description: 'Best 5 articles selected and compiled into a clean digest' },
      { title: 'Delivery',           description: 'Digest sent via email or posted to Discord every morning' },
    ],
    key_features: [
      { title: 'Topic-Specific',     description: 'Configured for your exact industry or niche — not generic news.' },
      { title: 'AI Summarisation',   description: 'Each article condensed to the key points — no fluff.' },
      { title: 'Top 5 Filter',       description: 'Only the most relevant articles make it into the digest.' },
      { title: 'Scheduled Delivery', description: 'Arrives every morning without any manual trigger.' },
    ],
    results: [
      'Team stays informed without spending time reading raw articles',
      'Industry developments never missed',
      'Morning digest delivered automatically — zero manual effort',
      'Configurable for any topic, any delivery channel',
    ],
    tech_stack: [
      { tool: 'n8n',              role: 'Workflow engine and scheduler' },
      { tool: 'NewsAPI',          role: 'Article collection' },
      { tool: 'OpenAI',           role: 'Article summarisation' },
      { tool: 'Gmail / Discord',  role: 'Digest delivery' },
    ],
    time_saved:   '1–2 hours per day on news reading and summarisation',
    money_saved:  'Replaces newsletter subscriptions and research assistant time',
    is_published: true,
    sort_order:   5,
    description:  'Staying informed requires reading dozens of articles daily across multiple sources. Teams either spend hours on this or stay uninformed. Important industry developments get missed.',
    brand:        'skillIT',
    is_ongoing:   false,
    image_urls:   [],
    tech_tags:    ['n8n', 'NewsAPI', 'OpenAI', 'Gmail', 'Discord'],
  },

  {
    title: 'AI Bug Triage System',
    tagline: 'Bug reports classified, ticketed, and escalated — before a developer reads them',
    slug: 'ai-bug-triage',
    tool: 'n8n',
    industry: 'Software Development, Freelance Dev Teams, Agencies',
    builder_name: 'Minahal Salahudin',
    builder_role: 'Automation Engineer and Trainer',
    project_type: 'automation',
    problem_statement:
      'Bug reports arrive from everywhere with no structure. Developers read each one manually, try to assess severity, and move it to a board if they remember. Critical issues sit unnoticed. Minor annoyances get escalated. Teams spend more time managing bugs than fixing them.',
    how_it_works: [
      { title: 'Report Submitted',       description: 'Bug submitted via web form or Telegram message' },
      { title: 'AI Classification',      description: 'Local LLaMA 3 (via Ollama) classifies severity as Critical, High, Medium, or Low — zero API cost' },
      { title: 'Notion Ticket',          description: 'Structured ticket created in Notion with all fields: severity, component, reproduction steps, suggested fix' },
      { title: 'MySQL Logging',          description: 'Full bug metadata logged to MySQL for analytics and history' },
      { title: 'Reporter Confirmation',  description: 'Reporter receives a Gmail confirmation with their Notion ticket link' },
      { title: 'Severity Routing',       description: 'Critical and High bugs trigger Telegram alert to team lead. Critical bugs also send a Gmail alert.' },
    ],
    key_features: [
      { title: 'Local AI — Zero API Cost',    description: 'Runs LLaMA 3 via Ollama on your own machine. No API key, no per-request cost, no internet dependency for inference.' },
      { title: '4-Way Severity Routing',      description: 'Critical, High, Medium, Low — each routed differently. Critical gets both Telegram and email alerts.' },
      { title: 'Automatic Notion Tickets',    description: 'Every bug becomes a structured Notion ticket with AI-extracted fields — no manual ticket creation.' },
      { title: 'Full Audit Trail',            description: 'Every bug logged to MySQL with timestamp, severity, component, and Notion URL.' },
      { title: 'Productisable',               description: 'Can be set up for any client as a custom bug triage system — estimated PKR 30,000–60,000 per setup.' },
    ],
    results: [
      'Every bug classified by severity automatically — no manual triage',
      'Critical issues escalated to team lead in under 60 seconds',
      'Structured Notion tickets created for every report regardless of how it was written',
      'Reporter always gets confirmation — no report silently disappears',
      'Full bug history queryable from MySQL',
    ],
    tech_stack: [
      { tool: 'n8n',                  role: 'Workflow engine' },
      { tool: 'Ollama + LLaMA 3',     role: 'Local AI classification — zero API cost' },
      { tool: 'Notion API',           role: 'Bug ticket creation and tracking' },
      { tool: 'MySQL',                role: 'Bug history and analytics logging' },
      { tool: 'Telegram Bot API',     role: 'Severity alerts to team lead' },
      { tool: 'Gmail / SMTP',         role: 'Reporter confirmation and critical alerts' },
    ],
    time_saved:   '1–2 hours per day on bug triage and ticket creation',
    money_saved:  'Replaces Jira or Linear (PKR 30,000–60,000 per client as a productised service)',
    is_published: true,
    sort_order:   6,
    description:  'Bug reports arrive from everywhere with no structure. Developers read each one manually, try to assess severity, and move it to a board if they remember. Critical issues sit unnoticed. Minor annoyances get escalated. Teams spend more time managing bugs than fixing them.',
    brand:        'skillIT',
    is_ongoing:   false,
    image_urls:   [],
    tech_tags:    ['n8n', 'Ollama', 'LLaMA 3', 'Notion API', 'MySQL', 'Telegram', 'Gmail'],
  },
]

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing env vars. Got:')
    console.error('  NEXT_PUBLIC_SUPABASE_URL:', url ? url.slice(0, 40) + '…' : '(missing)')
    console.error('  SUPABASE_SERVICE_ROLE_KEY:', key ? key.slice(0, 20) + '…' : '(missing)')
    process.exit(1)
  }
  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  console.log('Connecting to Supabase…')
  console.log('URL:', url)

  // Delete existing slugs to allow re-running the seed
  const slugs = projects.map(p => p.slug)
  const { error: delErr } = await supabase
    .from('projects')
    .delete()
    .in('slug', slugs)
  if (delErr) {
    console.error('Error clearing existing rows:', delErr.message)
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(projects)
    .select('id, title, slug')

  if (error) {
    console.error('Insert failed:', error.message)
    process.exit(1)
  }

  console.log(`\nInserted ${data.length} projects:`)
  for (const row of data) {
    console.log(`  ✓ [${row.id}]  ${row.title}  (${row.slug})`)
  }
  console.log('\nDone.')
}

main()
