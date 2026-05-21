-- ============================================================
-- 008_workshop_seed.sql
-- Ensure extended event columns exist, then seed workshop data
-- ============================================================

-- Columns referenced in the TypeScript Event type but not in the
-- initial schema — safe to add idempotently.
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_open boolean NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_online         boolean NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location          text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS content           text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS cover_image       text;

-- ============================================================
-- Past Workshop 1 — April: n8n Mastery Workshop
-- ============================================================
INSERT INTO public.events (
  title, slug, description,
  date, seats, seats_taken,
  type, brand,
  is_paid, price,
  is_published, registration_open, is_online,
  tools_covered, form_schema
) VALUES (
  'n8n Mastery Workshop',
  'n8n-mastery-workshop-april-2025',
  'A foundational workshop covering n8n from basics to 7 complete workflows. Topics covered: nodes, databases, APIs, conditionals, and full automation logic.',
  '2025-04-15 10:00:00+05:00',
  140,
  140,
  'workshop',
  'skillsync',
  false,
  0,
  true,
  false,
  true,
  ARRAY['n8n', 'Automation', 'APIs', 'Databases'],
  '{"fields":[]}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Past Workshop 2 — May: n8n Advanced Workshop
-- ============================================================
INSERT INTO public.events (
  title, slug, description,
  date, seats, seats_taken,
  type, brand,
  is_paid, price,
  is_published, registration_open, is_online,
  tools_covered, form_schema
) VALUES (
  'n8n Advanced Workshop',
  'n8n-advanced-workshop-may-2025',
  'An advanced intensive for 10 selected builders. 5 portfolio-level projects built live: WhatsApp Customer Support Bot, NewsDigest AI, Instagram Leads Capture AI, CV Screener AI, AI Bug Triage Reporter.',
  '2025-05-10 10:00:00+05:00',
  10,
  10,
  'workshop',
  'skillsync',
  false,
  0,
  true,
  false,
  true,
  ARRAY['n8n', 'AI Automation', 'WhatsApp Bot', 'OpenAI'],
  '{"fields":[]}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Upcoming Workshop — 26 May 2025: n8n Launchpad
-- registration_open = false because registration is handled by
-- the custom /workshops/register form, not the generic form.
-- ============================================================
INSERT INTO public.events (
  title, slug, description,
  date, seats, seats_taken,
  type, brand,
  is_paid, price,
  is_published, registration_open, is_online,
  tools_covered, form_schema
) VALUES (
  'n8n Launchpad — From Zero to Portfolio in 5 Hours',
  'n8n-launchpad-may-2025',
  'A 5-hour, fully hands-on automation workshop designed for anyone who wants to stop watching tutorials and start building real things. In the first 3 hours, you''ll work through 3 live workflows covering the core pillars of modern automation — API integrations, conditional logic, AI-powered flows, and database connections — with zero assumed knowledge and zero fluff. The final 2 hours are a guided project: you''ll build a CV Screener + Notion Talent Board, a production-ready automation you can immediately add to your portfolio. Taught live by practising Automation Engineers who build these systems professionally — not educators reading slides.',
  '2025-05-26 10:00:00+05:00',
  30,
  0,
  'workshop',
  'skillsync',
  true,
  450,
  true,
  false,
  true,
  ARRAY['n8n', 'APIs', 'AI Automation', 'Notion', 'CV Screener'],
  '{"fields":[]}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
