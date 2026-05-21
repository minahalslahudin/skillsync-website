-- ============================================================
-- 007_workshop_registrations.sql
-- Paid workshop sign-ups with payment receipt verification
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  full_name           text        NOT NULL,
  email               text        NOT NULL,
  phone               text        NOT NULL,
  university          text        NOT NULL,
  semester            text        NOT NULL,
  skill_level         text        NOT NULL,
  reason              text        NOT NULL,
  committed           boolean     NOT NULL,
  referral_source     text        NOT NULL,
  payment_receipt_url text,
  workshop_id         text        NOT NULL DEFAULT 'n8n-launchpad-may-2025',
  status              text        NOT NULL DEFAULT 'pending',
  CONSTRAINT workshop_registrations_status_check
    CHECK (status IN ('pending', 'confirmed', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_wr_email     ON public.workshop_registrations(email);
CREATE INDEX IF NOT EXISTS idx_wr_status    ON public.workshop_registrations(status);
CREATE INDEX IF NOT EXISTS idx_wr_workshop  ON public.workshop_registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_wr_created   ON public.workshop_registrations(created_at DESC);

-- ============================================================
-- Row level security
-- ============================================================

ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Public (anon) and authenticated users can insert registrations
CREATE POLICY "Public can submit workshop registration"
  ON public.workshop_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read registrations
CREATE POLICY "Admins can read workshop registrations"
  ON public.workshop_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update registration status
CREATE POLICY "Admins can update workshop registrations"
  ON public.workshop_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================
-- STORAGE: payment-receipts (private bucket)
-- Receipts uploaded by registrants, read only by admins
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-receipts',
  'payment-receipts',
  false,
  5242880,
  ARRAY[
    'image/jpeg',
    'image/png',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Admins can view uploaded receipts
CREATE POLICY "payment_receipts_admin_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-receipts'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
