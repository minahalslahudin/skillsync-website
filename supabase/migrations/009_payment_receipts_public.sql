-- ============================================================
-- 009_payment_receipts_public.sql
-- Make payment-receipts bucket publicly readable.
-- File names are randomly generated (timestamp + email hash),
-- so public access is safe — no enumeration risk.
-- This lets the admin dashboard link directly to receipts.
-- ============================================================
UPDATE storage.buckets SET public = true WHERE id = 'payment-receipts';
