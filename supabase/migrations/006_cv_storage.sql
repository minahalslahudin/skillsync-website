-- ============================================================
-- 006_cv_storage.sql
-- CV upload support: new column + private storage bucket
-- ============================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS cv_url text;

-- ============================================================
-- STORAGE: cvs (private bucket — no public read)
-- file_size_limit: 20 MB
-- Supabase validates the Content-Type against allowed_mime_types
-- on every upload, providing server-side MIME enforcement.
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  false,
  20971520,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Only authenticated admins may SELECT (required for createSignedUrl).
-- INSERT/UPDATE/DELETE go through the service-role key in API routes,
-- which bypasses RLS entirely — no additional policy needed for writes.
CREATE POLICY "cvs_admin_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'cvs'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
