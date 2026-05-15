-- ============================================================
-- 003_functions.sql
-- skillSYNC × skillIT — Database Functions & Triggers
-- Run AFTER 001_initial_schema.sql and 002_rls_policies.sql
-- ============================================================

-- ============================================================
-- FUNCTION: handle_new_user()
-- Trigger function that auto-creates a public.users profile
-- row whenever a new row is inserted into auth.users.
-- SECURITY DEFINER: runs as the function owner, bypassing RLS.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    avatar_url
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger: fires after every new auth signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: increment_seats_taken(p_event_id uuid)
-- Atomically increments events.seats_taken by 1.
-- Raises an exception if the event is full or not found,
-- so the calling registration INSERT can be rolled back.
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_seats_taken(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET seats_taken = seats_taken + 1
  WHERE id = p_event_id
    AND (seats IS NULL OR seats_taken < seats);

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Event % is full or does not exist', p_event_id
      USING ERRCODE = 'P0001';
  END IF;
END;
$$;

-- ============================================================
-- FUNCTION: sync_warning_count()
-- Trigger function that keeps users.warning_count accurate
-- whenever a warning is inserted, updated, or deleted.
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_warning_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- On DELETE the row is in OLD, on INSERT/UPDATE it is in NEW
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);

  UPDATE public.users
  SET warning_count = (
    SELECT COUNT(*)
    FROM public.warnings
    WHERE user_id = v_user_id
      AND is_resolved = false
  )
  WHERE id = v_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE TRIGGER on_warning_change
  AFTER INSERT OR UPDATE OR DELETE ON public.warnings
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_warning_count();

-- ============================================================
-- FUNCTION: get_unread_announcement_count(p_user_id uuid)
-- Returns the number of announcements the user hasn't read yet.
-- Used in dashboard notification badge.
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_unread_announcement_count(p_user_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.announcements a
  WHERE (
    a.target = 'all'
    OR a.target_user_id = p_user_id
    OR a.target_department = (
      SELECT department FROM public.users WHERE id = p_user_id
    )
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.announcement_reads r
    WHERE r.announcement_id = a.id
      AND r.user_id = p_user_id
  );
$$;
