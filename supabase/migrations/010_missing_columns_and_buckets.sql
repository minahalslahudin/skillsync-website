-- ============================================================
-- 010_missing_columns_and_buckets.sql
-- Add columns expected by TypeScript types + ProjectEditor,
-- create storage buckets not covered by earlier migrations,
-- and fix site_settings policies to use the is_admin() function.
-- ============================================================

-- ── Projects: add columns present in TypeScript type but missing from schema ──
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description  text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_url     text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repo_url     text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS content      text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_image  text;

-- ── Storage: avatars bucket (profile picture uploads from ProfileForm) ────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "avatars_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY IF NOT EXISTS "avatars_auth_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING     (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');

-- ── Storage: public bucket (project images uploaded by admins via ProjectEditor) ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public',
  'public',
  true,
  10485760,
  NULL
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "public_bucket_auth_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'public');

CREATE POLICY IF NOT EXISTS "public_bucket_anon_select"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'public');

-- ── Fix site_settings write policies to use the SECURITY DEFINER is_admin() ──
-- The original policies in 005 used an inline EXISTS query that could
-- silently return 0 rows (no error) when the UPDATE RLS check failed,
-- making saves appear to succeed while nothing was written to the DB.
DROP POLICY IF EXISTS "Admin write settings"  ON public.site_settings;
DROP POLICY IF EXISTS "Admin insert settings" ON public.site_settings;

CREATE POLICY "Admin write settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING     (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin insert settings" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- ── Fix workshop_registrations policies to use is_admin() ────────────────────
DROP POLICY IF EXISTS "Admins can read workshop registrations"   ON public.workshop_registrations;
DROP POLICY IF EXISTS "Admins can update workshop registrations" ON public.workshop_registrations;

CREATE POLICY "Admins can read workshop registrations"
  ON public.workshop_registrations FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update workshop registrations"
  ON public.workshop_registrations FOR UPDATE TO authenticated
  USING     (is_admin())
  WITH CHECK (is_admin());
