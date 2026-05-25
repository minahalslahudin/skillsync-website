-- ============================================================
-- 012_fix_workshop_seats.sql
-- Correct seats / seats_taken for past and closed workshops
-- ============================================================

-- n8n Advanced Workshop ("n8n 2.0"): 10 attended, 0 seats left.
-- seats_taken was not updated because the seed used ON CONFLICT DO NOTHING.
UPDATE public.events
SET seats       = 10,
    seats_taken = 10
WHERE slug = 'n8n-advanced-workshop-may-2026';

-- n8n Launchpad: 12 registrations confirmed, registration closed, 0 seats left.
-- seats_taken for paid workshops is derived live from workshop_registrations,
-- so only seats needs to match the confirmed registrant count (12).
UPDATE public.events
SET seats             = 12,
    registration_open = false
WHERE slug = 'n8n-launchpad-may-2026';
