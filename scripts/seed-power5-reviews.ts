// ─────────────────────────────────────────────────────────────────────────────
// Seed the 23 Power 5 workshop reviews directly into the live Supabase DB.
//
// Usage (from the `skillsync-website` folder):
//   npx tsx scripts/seed-power5-reviews.ts
//
// What it does:
//   • Reads .env.local so SUPABASE_SERVICE_ROLE_KEY is available.
//   • Checks for an existing row with the same reviewer + opening phrase and
//     skips it (safe to re-run).
//   • Inserts each remaining review with is_approved = true, so they show up
//     on /reviews immediately — no admin approval step needed.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Load .env.local ─────────────────────────────────────────────────────────
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

// ── Review data ─────────────────────────────────────────────────────────────
const WORKSHOP = 'Power 5 Workshop'
const BRAND    = 'skillsync'
const ROLE     = 'Workshop Attendee'

interface SeedReview {
  reviewer_name: string
  rating: number
  body: string
  submitted_at: string
}

const REVIEWS: SeedReview[] = [
  // ── Session 1 · Web Dev (Sep 26–28) ──────────────────────────────────────
  {
    reviewer_name: 'Ayesha Munawar Hashmi',
    rating: 5,
    body:
      "WebDev was my childhood dream till AI came in and there were talks everywhere how web developers would not be needed — until I recently discovered how I can use AI to maximize my output and actually use it to help me develop top-notch websites. Web Development has never been easier.",
    submitted_at: '2026-09-26T13:00:00Z',
  },
  {
    reviewer_name: 'Esha Toor',
    rating: 5,
    body:
      "Before these few hours, I had almost no experience with web development, but now I feel much more comfortable with the idea of making a website. I think I could work on and deploy a website for an online clothing store, especially now that I understand the basic process and know where to start. What surprised me most was how much can be done in just a few hours — going from knowing almost nothing to actually building something gave me a lot of confidence. I definitely don't regret joining — it made web development feel much more approachable and gave me the motivation to explore it further.",
    submitted_at: '2026-09-27T13:00:00Z',
  },
  {
    reviewer_name: 'Hadi Amer',
    rating: 5,
    body:
      "I am comfortable in making a website but still have a few doubts regarding its security features. These few hours have improved my vision and understanding by a great margin — I have come to know how to connect and integrate backend with frontend and how to deploy my site. The top-down approach is very great for setting up a great headstart pace and giving us confidence to do the work.",
    submitted_at: '2026-09-28T13:00:00Z',
  },
  {
    reviewer_name: 'Izza Maryam',
    rating: 5,
    body:
      "At first, I thought making a website was a very big deal, but after taking the session from SkillSync, I realized it is very easy. These few hours made me learn a lot of things that I never realized I needed to learn. The session was very interesting and interactive enough to build my interest in this field. I would never regret my decision of joining this session. I am in favor of the top-down approach because it makes you build something that keeps you interested.",
    submitted_at: '2026-09-28T13:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Adeel Pervez',
    rating: 5,
    body:
      "After taking the web dev session I got to know a lot of web dev terminologies which will help me in creating a website through vibe coding. These hours helped me in learning a full web dev process. It also makes me good at prompting for websites because now I know a lot of web dev concepts. It helps me in learning from mistakes — I have to do big things which compel me to make mistakes and then learn from them.",
    submitted_at: '2026-09-27T13:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Mohsin',
    rating: 4,
    body:
      "Honestly web development left me feeling a little confused at first — I initially thought Claude would handle everything for us. Later I discovered that Claude Code can actually do a lot more on its own. Overall this was useful but I know I need a lot more practice before I would call myself comfortable with web development. I do not regret joining — it gave me a starting point I would not have had otherwise.",
    submitted_at: '2026-09-27T13:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Pasha',
    rating: 5,
    body:
      "I am comfortable making a website now, and I feel confident that I could deploy a website for an online clothing store. I am also planning to continue learning more about web development. Going from knowing almost nothing to building something in just a few hours was surprising, and it showed me that I can learn and apply things quickly. The top-down approach gives you confidence because you are able to see the bigger picture and realize that you can actually build something from the first day.",
    submitted_at: '2026-09-28T13:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Yasir Suhail',
    rating: 5,
    body:
      "Yes, I can easily deploy websites now. It was a fun experience especially because I have made websites before but never deployed them. It was still fun learning new things like deployment and how to add sign-in with Google functionality. If you properly decide the main architecture of your website before prompting your AI tool, it will easily make the website properly once instead of handling so many errors later. Top-down approach really did help — with the right tricks and tools and prompts you can easily make a website in very less time.",
    submitted_at: '2026-09-27T13:00:00Z',
  },
  {
    reviewer_name: 'Rafay Khan',
    rating: 5,
    body:
      "After attending this workshop, I am comfortable making a website on my own. I am also confident that I can build and deploy a website for an online clothing store. Going from knowing nothing to building something new in just a few hours felt amazing. In my opinion, the top-down approach is the best way to learn — although it brings some doubts, building things practically helps us learn from our mistakes and gave us confidence from the very first day. I do not regret joining at all and I am proud of myself for being part of this.",
    submitted_at: '2026-09-27T13:00:00Z',
  },
  {
    reviewer_name: 'Zeeshan Azeem',
    rating: 5,
    body:
      "I really enjoyed this session of SkillSync, especially when I came to n8n automation. I always wanted to try out n8n but never got the time or proper guidance (YouTube is full of crap tutorials). I built 2 projects with n8n guided completely by Minahal and then went out on my own and built a Telegram automation chatbot for SkillSync. I already kind of knew how to build websites and deploy them (even did an internship in Web engineering before), so that part wasn't new to me.",
    submitted_at: '2026-09-27T13:00:00Z',
  },

  // ── Session 2 · LLMs + Chatbots (Sep 27–28, Oct 14) ──────────────────────
  {
    reviewer_name: 'Esha Toor',
    rating: 5,
    body:
      "Before these few hours, I had very little understanding of LLMs and context engineering, but now I feel much more comfortable with the basic concepts and how they work together when building a chatbot. Overall, the session was genuinely exciting because I got to go from knowing almost nothing to actually building and hosting a working chatbot. I now feel confident that I can start building one, figure things out, and learn along the way. The experience also made LLM development feel much less intimidating and showed me that I can actually create something with it.",
    submitted_at: '2026-09-27T14:00:00Z',
  },
  {
    reviewer_name: 'Hadi Amer',
    rating: 5,
    body:
      "I really liked exploring context engineering and concepts of LLM. The way temperature and system-prompt restrictions change the response is definitely worthy to be learnt in this era. I learned a lot about hosting a chatbot through GitHub and not just by buying domains. I am confident of using context engineering to restrict what a chatbot does. Overall I would say it was worth attending.",
    submitted_at: '2026-09-27T14:00:00Z',
  },
  {
    reviewer_name: 'Izza Maryam',
    rating: 5,
    body:
      "Honestly, building the chatbot was way easier than I expected going in. As a first-semester student, I didn't know much about LLMs or context engineering before this, so I was a little nervous — but it turned out to be genuinely fun, exciting, and really informative. Watching everything come together in just a few hours felt almost magical, going from knowing literally nothing to actually having a working chatbot hosted and running. It was absolutely worth attending — it helped me learn new concepts and I made my very first working project.",
    submitted_at: '2026-09-27T14:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Adeel Pervez',
    rating: 5,
    body:
      "After taking this session I got to know what LLMs and context engineering actually are. After these few hours I am feeling more confident because now I know many things related to chatbots. Now I know how to host bots and other related things. I am lucky that I attended this session because I learnt a lot of things in a very friendly environment.",
    submitted_at: '2026-09-28T14:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Mohsin',
    rating: 4,
    body:
      "Honestly I learned new things that were unknown to me before, but at the same time the sheer amount of information made me a little confused. There were many different tools, each with its own way of working. I do plan to keep learning more about LLMs and context engineering. Spending these hours was truly worth it because it answered questions I had about how LLMs are trained and how these systems work — but I feel I still need to understand the concepts more.",
    submitted_at: '2026-09-27T14:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Noraiz Waseem',
    rating: 5,
    body: "Yeah, I am comfortable with the basic concepts of LLM and will try to do more with this.",
    submitted_at: '2026-10-14T14:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Pasha',
    rating: 5,
    body:
      "Yes, I am comfortable with the concepts of LLM and have a better understanding of context engineering. This session has opened new horizons for me. These few hours allowed for impartation of knowledge on how to customize any LLM.",
    submitted_at: '2026-09-28T14:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Yasir Suhail',
    rating: 4,
    body:
      "Through the template provided, I can build any kind of chatbot. Overall, I would say it was a fun session and I learned a lot of new things, like how to get free APIs of some AI models and how to build your own chatbot through that. It was a good experience. I also learnt a little bit about how guardrails are implemented. I think it was a great experience from knowing nothing to making my own chatbot.",
    submitted_at: '2026-09-27T14:00:00Z',
  },
  {
    reviewer_name: 'Rafay Khan',
    rating: 5,
    body:
      "Honestly, I'm now pretty comfortable with the concepts of LLMs and context engineering. Before this session I barely knew anything about them, so going from knowing nothing to actually building my own chatbot and hosting it in just a few hours felt amazing. It was totally worth attending. The whole thing got me really excited and I've become genuinely interested in making creative stuff like this. A big thank you to my teacher for putting in so much effort and making everything so clear for us.",
    submitted_at: '2026-09-27T14:00:00Z',
  },

  // ── Session 3 · n8n Automation + CV Bot (Oct 11–16) ──────────────────────
  {
    reviewer_name: 'Hadi Amer',
    rating: 5,
    body:
      "I am very much comfortable with using n8n now. This was an amazing workshop and I am genuinely excited to do more with it. I would say it is worth attending, and the final project of the CV recruitment auto-bot helped a lot in becoming confident. If I were to do it alone without the workshop I would probably have done only 30 to 40% as much as I have done by attending. I would prefer to get a headstart with your workshop — now once I have understood how the general n8n environment works I can work on polishing my skills further on my own.",
    submitted_at: '2026-10-11T15:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Noraiz Waseem',
    rating: 5,
    body: "Mam, overall the course was really informative.",
    submitted_at: '2026-10-14T15:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Pasha',
    rating: 5,
    body:
      "Yes, after making these projects — especially after the final project — I can say I can make new projects, especially not limiting to general tools like Google Forms but my own customized ones.",
    submitted_at: '2026-10-16T15:00:00Z',
  },
  {
    reviewer_name: 'Muhammad Yasir Suhail',
    rating: 5,
    body:
      "It was obviously worth it. I knew a little bit before about automation, and I always thought that it was a cool skill to learn. I even tried making an automation before but was unable to because connecting different accounts with n8n was something I was unable to do. But now I am confident that I can make good automations and connect my accounts with n8n easily. I am pretty comfortable with it, and I will try to dive deep into concepts like using AI models in n8n.",
    submitted_at: '2026-10-13T15:00:00Z',
  },
]

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing env vars in .env.local:')
    console.error('  NEXT_PUBLIC_SUPABASE_URL:', url ? url.slice(0, 40) + '…' : '(missing)')
    console.error('  SUPABASE_SERVICE_ROLE_KEY:', key ? key.slice(0, 20) + '…' : '(missing)')
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  console.log(`\nConnected to Supabase: ${url}`)
  console.log(`Candidates: ${REVIEWS.length} reviews from the Power 5 workshop\n`)

  // De-dupe against existing rows: skip any (reviewer_name, first-80-chars body)
  // that's already in the DB. Lets you re-run this script safely.
  const { data: existing, error: fetchErr } = await supabase
    .from('reviews')
    .select('reviewer_name, body')
    .eq('workshop_or_service', WORKSHOP)
  if (fetchErr) {
    console.error('Failed to read existing reviews:', fetchErr.message)
    process.exit(1)
  }

  const seen = new Set(
    (existing ?? []).map((r: { reviewer_name: string; body: string }) =>
      `${r.reviewer_name}|${r.body.slice(0, 80)}`
    )
  )

  const toInsert = REVIEWS
    .filter((r) => !seen.has(`${r.reviewer_name}|${r.body.slice(0, 80)}`))
    .map((r) => ({
      reviewer_name:       r.reviewer_name,
      reviewer_role:       ROLE,
      workshop_or_service: WORKSHOP,
      rating:              r.rating,
      body:                r.body,
      brand:               BRAND,
      is_approved:         true,
      is_featured:         false,
      submitted_at:        r.submitted_at,
    }))

  const skipped = REVIEWS.length - toInsert.length
  if (skipped > 0) console.log(`Skipping ${skipped} review(s) already in DB.`)
  if (toInsert.length === 0) {
    console.log('Nothing to insert — all reviews are already seeded.\n')
    return
  }

  console.log(`Inserting ${toInsert.length} review(s)…\n`)
  const { data, error } = await supabase
    .from('reviews')
    .insert(toInsert)
    .select('id, reviewer_name, rating')

  if (error) {
    console.error('Insert failed:', error.message)
    process.exit(1)
  }

  for (const row of data ?? []) {
    console.log(`  ✓  ${row.reviewer_name.padEnd(28)} ${row.rating}★   [${row.id}]`)
  }
  console.log(`\nDone — ${data?.length ?? 0} review(s) inserted.`)
  console.log('All rows are is_approved = true, so they show immediately on /reviews.\n')
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
