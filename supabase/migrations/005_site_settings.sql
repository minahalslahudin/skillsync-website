-- Site-wide settings (key/value store)
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed defaults (skip if already present)
INSERT INTO site_settings (key, value) VALUES
  ('hero_tagline_skillsync', 'Build. Learn. Earn.'),
  ('hero_tagline_skillit',   'We Build. You Scale.'),
  ('about_text',              ''),
  ('mission_statement',       ''),
  ('linkedin_url',            ''),
  ('instagram_url',           ''),
  ('youtube_url',             ''),
  ('github_url',              ''),
  ('whatsapp_link',           ''),
  ('show_reviews',            'true'),
  ('show_join_form',          'true'),
  ('maintenance_mode',        'false'),
  ('admin_email_applications',''),
  ('admin_email_reviews',     '')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read (needed for maintenance-mode check in middleware)
CREATE POLICY "Public read settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (TRUE);

-- Only admins can write
CREATE POLICY "Admin write settings" ON site_settings
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admin insert settings" ON site_settings
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE));

-- ─────────────────────────────────────────────────
-- Announcement read tracking
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcement_reads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID        NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (announcement_id, user_id)
);

ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own reads" ON announcement_reads
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users select own reads" ON announcement_reads
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
