-- ============================================================
-- 004_contacts.sql
-- Contact form submissions table
-- ============================================================

CREATE TABLE public.contacts (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text        NOT NULL,
  message    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Only admins can read contact submissions
CREATE POLICY "admins_read_contacts" ON public.contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Anyone can insert (public contact form)
CREATE POLICY "public_insert_contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);
