-- ============================================================
-- 013_external_registration.sql
-- Add external registration URL support + seed LLM Bootcamp event
-- ============================================================

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS
  external_registration_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS
  hide_seats_display boolean DEFAULT false;

-- ============================================================
-- skillSYNC presents: LLM Bootcamp 1.0 — 21 June 2026
-- External registration via Google Form; seats display hidden.
-- ============================================================
INSERT INTO public.events (
  title, slug, description,
  date, registration_deadline,
  type, brand,
  is_paid, price,
  is_published, registration_open, is_online,
  external_registration_url, hide_seats_display,
  tools_covered, form_schema
) VALUES (
  'LLM Bootcamp 1.0',
  'llm-bootcamp-1',
  'From tokens to tools in a single day, go from using ChatGPT to building with LLMs. A hands on bootcamp covering GPT, Claude, and Gemini, ending with two real AI products you will build yourself.',
  '2026-06-21 21:30:00+05:00',
  '2026-06-21 15:00:00+05:00',
  'workshop',
  'skillsync',
  true,
  100,
  true,
  true,
  true,
  'https://docs.google.com/forms/d/e/1FAIpQLSdBN93l5DL7cWEETEZgiO6ZRwOmeOF0r4qiOMCfCXq2O_nZ2w/viewform?usp=header',
  true,
  ARRAY['GPT', 'Claude', 'Gemini', 'LLMs'],
  '[]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
