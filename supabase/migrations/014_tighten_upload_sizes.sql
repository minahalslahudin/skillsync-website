-- ============================================================
-- 014_tighten_upload_sizes.sql
-- Security hardening (Sept 2026): reduce upload size caps from
-- 20 MB → 5 MB on the CV bucket. Payment-receipts is already 5 MB.
-- The application layer also enforces 5 MB, but the bucket policy
-- is the authoritative last line of defence.
-- ============================================================

UPDATE storage.buckets
   SET file_size_limit = 5242880  -- 5 * 1024 * 1024
 WHERE id = 'cvs';

-- Also affirm the payment-receipts cap in case an earlier UPDATE ever raised it.
UPDATE storage.buckets
   SET file_size_limit = 5242880
 WHERE id = 'payment-receipts';
