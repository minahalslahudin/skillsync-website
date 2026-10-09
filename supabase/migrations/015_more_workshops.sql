-- ============================================================
-- 015_more_workshops.sql
-- Seeds the remaining 9 past workshops (5-13) plus two small
-- additive columns:
--
--   events.attendees  int   NULLABLE
--     Explicit attendance count for completed workshops.
--     WorkshopCard and the detail page prefer this over the
--     live-derived seats_taken for past paid workshops that
--     were never registered through workshop_registrations.
--
--   events.cohort     text  NULLABLE
--     Grouping label (e.g. 'AI Cohort 1.0', 'POWER 5') shown
--     as a small badge on the card.
--
-- Existing rows are unaffected: both columns default to NULL,
-- and all inserts use ON CONFLICT (slug) DO NOTHING, so this
-- migration is safe to re-run.
-- ============================================================

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS attendees int,
  ADD COLUMN IF NOT EXISTS cohort    text;

ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_attendees_check;
ALTER TABLE public.events
  ADD CONSTRAINT events_attendees_check CHECK (attendees IS NULL OR attendees >= 0);

CREATE INDEX IF NOT EXISTS idx_events_cohort ON public.events(cohort);

-- ============================================================
-- AI COHORT 1.0 — "Know the Stack"  (3 workshops, 30 attended)
-- Price: Rs 4,500 bundle for the full 3-workshop cohort.
-- Each session starts at 9:30 AM Pakistan time.
-- ============================================================

-- 5. N8N Bootcamp  (Sat, 11 Jul 2026)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'N8N Bootcamp',
  'n8n-bootcamp-ai-cohort-1-jul-2026',
  'Go from understanding AI to shipping something a client would actually pay for, with no dev team and no complex infra. Part of the AI Cohort 1.0 bundle (Rs 4,500 for all three workshops).',
  '2026-07-11 09:30:00+05:00',
  'workshop', 'skillsync',
  true, 4500,
  30, 30,
  30, 'AI Cohort 1.0',
  true, false, true,
  ARRAY['n8n', 'APIs', 'Databases', 'Slack', 'Discord', 'Notion'],
  '[]'::jsonb,
  '<h2>What you learn</h2><ul><li>Installation to Mid-Level Nodes</li><li>Databases, APIs and Sheets</li><li>Slack, Discord and Notion integrations</li></ul><h2>What you build</h2><p>Five mini projects. Portfolio project: Auto Recruitment Bot.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Context Engineering  (Sun, 12 Jul 2026)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'Context Engineering',
  'context-engineering-ai-cohort-1-jul-2026',
  'Everyone is using AI, but almost no one knows how to actually talk to it. The one skill that makes every other AI skill work better. Part of the AI Cohort 1.0 bundle (Rs 4,500 for all three workshops).',
  '2026-07-12 09:30:00+05:00',
  'workshop', 'skillsync',
  true, 4500,
  30, 30,
  30, 'AI Cohort 1.0',
  true, false, true,
  ARRAY['Prompting', 'ReAct', 'Defensive Prompting', 'Jailbreaking'],
  '[]'::jsonb,
  '<h2>What you learn</h2><ul><li>Prompt Anatomy and ReAct Patterns</li><li>Bias, Leakage and Defensive Prompting</li><li>Injection and Jailbreaking</li></ul><h2>What you build</h2><p>Eight practical tasks, Prompt Mental Lab, Inception Redux. Portfolio project: ContextTree.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- 7. LLMs Bootcamp  (Mon, 13 Jul 2026)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'LLMs Bootcamp',
  'llms-bootcamp-ai-cohort-1-jul-2026',
  'Stop copy-pasting into ChatGPT. Learn to wire AI models directly into your own code, tools and products. Part of the AI Cohort 1.0 bundle (Rs 4,500 for all three workshops).',
  '2026-07-13 09:30:00+05:00',
  'workshop', 'skillsync',
  true, 4500,
  30, 30,
  30, 'AI Cohort 1.0',
  true, false, true,
  ARRAY['LLMs', 'APIs', 'RAG', 'Embeddings', 'FastAPI'],
  '[]'::jsonb,
  '<h2>What you learn</h2><ul><li>Tokens, Context and Pricing</li><li>API Calling and Tool Schemas</li><li>RAG, Embeddings and FastAPI</li></ul><h2>What you build</h2><p>Seven practical tasks, CU Chatbot, NotebookLM 1.0. Portfolio project: Multi-Agent Research Assistant.</p><p><em>Cohort 1.0 sets up everything needed for Cohort 2.0: Agentic AI, RAG, GenAI, FastAPI and Coded Automation.</em></p>'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 8. Python for AI — Practical Drills  (22 attended)
-- Price: Rs 2,500. Format: 2 weekends.
-- Exact dates not provided; leaving date NULL. Card will render
-- as a past workshop with no date line. UPDATE later with the
-- real completion date.
-- ============================================================
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'Python for AI — Practical Drills',
  'python-for-ai-practical-drills',
  'Two weekends of drills that take you from Python basics to shipping a working AI agent. Walk away with two portfolio-ready projects and the real skills behind LLM APIs, RAG and agents.',
  NULL,
  'workshop', 'skillsync',
  true, 2500,
  22, 22,
  22, NULL,
  true, false, true,
  ARRAY['Python', 'LLM APIs', 'RAG', 'Agents', 'Vector DBs'],
  '[]'::jsonb,
  '<h2>Drill 1.0 — Weekend 1</h2><p>Python foundations covering syntax, data structures, functions, error handling, working with APIs, and calling an LLM directly through its Python SDK. <strong>Capstone 1:</strong> a CLI tool that talks to a live AI model.</p><h2>Drill 2.0 — Weekend 2</h2><p>Embeddings, vector databases, RAG pipelines, and how to design an AI agent with tools, memory and guardrails. <strong>Capstone 2:</strong> a working AI agent that retrieves knowledge and returns structured results.</p><h2>What you walk away with</h2><ul><li>Two portfolio-ready projects for your resume or GitHub.</li><li>Practical skills in LLM APIs, RAG and agents, the most in-demand AI skills right now.</li><li>The ability to direct AI tools to do real work, not just chat with them.</li></ul>'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- POWER 5 — "5 tools. 5 projects. 5 certificates. One weekend."
-- Rs 7,500 for the full 5-workshop cohort. 20 attended.
-- Fri 25 Sep → Sun 27 Sep 2026 (Pakistan time, +05:00).
-- Price field holds the cohort bundle total; description makes
-- that explicit so the card is not misread as per-workshop.
-- ============================================================

-- 9. N8N Automation  (Fri, 25 Sep 2026, 8-11 PM)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'N8N Automation',
  'n8n-automation-power-5-sep-2026',
  'Businesses pay well for anyone who can automate manual work. One of the fastest-growing, best-paid entry roles in tech. Part of the POWER 5 cohort bundle (Rs 7,500 for all five workshops).',
  '2026-09-25 20:00:00+05:00',
  'workshop', 'skillsync',
  true, 7500,
  20, 20,
  20, 'POWER 5',
  true, false, true,
  ARRAY['n8n', 'Automation', 'APIs'],
  '[]'::jsonb,
  '<p>Three hours live. One tool. One project. One certificate. Businesses pay well for anyone who can automate manual work and it is one of the fastest-growing, best-paid entry roles in tech.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- 10. Context Engineering + LLMs  (Sat, 26 Sep 2026, 9 AM - 12 PM)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'Context Engineering + LLMs',
  'context-engineering-llms-power-5-sep-2026',
  'Every company wants AI features, almost nobody knows how to build them safely. One of the newest, most in-demand skills on the market. Part of the POWER 5 cohort bundle (Rs 7,500 for all five workshops).',
  '2026-09-26 09:00:00+05:00',
  'workshop', 'skillsync',
  true, 7500,
  20, 20,
  20, 'POWER 5',
  true, false, true,
  ARRAY['Prompting', 'LLMs', 'APIs'],
  '[]'::jsonb,
  '<p>Three hours live. One tool. One project. One certificate. Every company wants AI features, almost nobody knows how to build them safely.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- 11. Full Stack Web Dev with AI  (Sat, 26 Sep 2026, 8-11 PM)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'Full Stack Web Dev with AI',
  'full-stack-web-dev-with-ai-power-5-sep-2026',
  'Still one of the highest-paid, most consistently hired entry-level tech roles worldwide. Part of the POWER 5 cohort bundle (Rs 7,500 for all five workshops).',
  '2026-09-26 20:00:00+05:00',
  'workshop', 'skillsync',
  true, 7500,
  20, 20,
  20, 'POWER 5',
  true, false, true,
  ARRAY['Full Stack', 'AI', 'Web Dev'],
  '[]'::jsonb,
  '<p>Three hours live. One tool. One project. One certificate. Full-stack web development is still one of the highest-paid, most consistently hired entry-level tech roles worldwide.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- 12. SQL for Data Analysis  (Sun, 27 Sep 2026, 9 AM - 12 PM)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'SQL for Data Analysis',
  'sql-for-data-analysis-power-5-sep-2026',
  'The most underrated, highest-salary-per-hour skill in tech. Every company runs on a database, and it is a hiring filter almost everywhere. Part of the POWER 5 cohort bundle (Rs 7,500 for all five workshops).',
  '2026-09-27 09:00:00+05:00',
  'workshop', 'skillsync',
  true, 7500,
  20, 20,
  20, 'POWER 5',
  true, false, true,
  ARRAY['SQL', 'Data Analysis'],
  '[]'::jsonb,
  '<p>Three hours live. One tool. One project. One certificate. SQL is the most underrated, highest-salary-per-hour skill in tech, and a hiring filter almost everywhere.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- 13. Hugging Face Environment  (Sun, 27 Sep 2026, 8-11 PM)
INSERT INTO public.events (
  title, slug, description,
  date, type, brand,
  is_paid, price,
  seats, seats_taken,
  attendees, cohort,
  is_published, registration_open, is_online,
  tools_covered, form_schema, content
) VALUES (
  'Hugging Face Environment',
  'hugging-face-environment-power-5-sep-2026',
  'AI and ML tool fluency is becoming a baseline expectation in hiring, not a bonus. Part of the POWER 5 cohort bundle (Rs 7,500 for all five workshops).',
  '2026-09-27 20:00:00+05:00',
  'workshop', 'skillsync',
  true, 7500,
  20, 20,
  20, 'POWER 5',
  true, false, true,
  ARRAY['Hugging Face', 'AI/ML'],
  '[]'::jsonb,
  '<p>Three hours live. One tool. One project. One certificate. AI and ML tool fluency is becoming a baseline expectation in hiring, not a bonus.</p>'
)
ON CONFLICT (slug) DO NOTHING;
