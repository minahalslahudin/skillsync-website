-- ============================================================
-- 002_rls_policies.sql
-- skillSYNC × skillIT — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- Enable RLS on every table
-- ============================================================
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warnings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter         ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION: is_admin()
-- SECURITY DEFINER bypasses RLS on the users table,
-- preventing infinite recursion in users policies.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid()),
    false
  );
$$;

-- ============================================================
-- USERS
-- ============================================================
-- Own row visible to self; all rows visible to admins
CREATE POLICY "users_select"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR is_admin());

-- Users update their own profile; admins update any profile
CREATE POLICY "users_update"
  ON public.users FOR UPDATE
  USING (auth.uid() = id OR is_admin())
  WITH CHECK (auth.uid() = id OR is_admin());

-- Only admins hard-delete user profiles
CREATE POLICY "users_delete"
  ON public.users FOR DELETE
  USING (is_admin());

-- INSERT is handled exclusively by the handle_new_user() SECURITY DEFINER trigger.
-- No INSERT policy is granted to the authenticated role.

-- ============================================================
-- APPLICATIONS
-- ============================================================
-- Anyone (including anonymous) may submit an application
CREATE POLICY "applications_insert"
  ON public.applications FOR INSERT
  WITH CHECK (true);

-- Only admins may read applications (private PII)
CREATE POLICY "applications_select"
  ON public.applications FOR SELECT
  USING (is_admin());

CREATE POLICY "applications_update"
  ON public.applications FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "applications_delete"
  ON public.applications FOR DELETE
  USING (is_admin());

-- ============================================================
-- EVENTS
-- ============================================================
-- Published events visible to everyone; unpublished to admins only
CREATE POLICY "events_select"
  ON public.events FOR SELECT
  USING (is_published = true OR is_admin());

CREATE POLICY "events_insert"
  ON public.events FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "events_update"
  ON public.events FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "events_delete"
  ON public.events FOR DELETE
  USING (is_admin());

-- ============================================================
-- REGISTRATIONS
-- ============================================================
-- Anyone may register (auth or anon — form_data captures contact info)
CREATE POLICY "registrations_insert"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

-- Authenticated users see own registrations; admins see all
CREATE POLICY "registrations_select"
  ON public.registrations FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "registrations_update"
  ON public.registrations FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "registrations_delete"
  ON public.registrations FOR DELETE
  USING (is_admin());

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE POLICY "projects_select"
  ON public.projects FOR SELECT
  USING (is_published = true OR is_admin());

CREATE POLICY "projects_insert"
  ON public.projects FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "projects_update"
  ON public.projects FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "projects_delete"
  ON public.projects FOR DELETE
  USING (is_admin());

-- ============================================================
-- REVIEWS
-- ============================================================
-- Approved reviews are public; unapproved visible to admins only
CREATE POLICY "reviews_select"
  ON public.reviews FOR SELECT
  USING (is_approved = true OR is_admin());

-- Anyone may submit a review (ReviewForm on public site)
CREATE POLICY "reviews_insert"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Only admins approve, feature, or remove reviews
CREATE POLICY "reviews_update"
  ON public.reviews FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "reviews_delete"
  ON public.reviews FOR DELETE
  USING (is_admin());

-- ============================================================
-- TASKS
-- ============================================================
-- Assignee and assigner see their tasks; admins see all
CREATE POLICY "tasks_select"
  ON public.tasks FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR assigned_by = auth.uid()
    OR is_admin()
  );

-- Only admins create task assignments
CREATE POLICY "tasks_insert"
  ON public.tasks FOR INSERT
  WITH CHECK (is_admin());

-- Assignee may update their own task (submit work); admins update any
CREATE POLICY "tasks_update"
  ON public.tasks FOR UPDATE
  USING (assigned_to = auth.uid() OR is_admin())
  WITH CHECK (assigned_to = auth.uid() OR is_admin());

CREATE POLICY "tasks_delete"
  ON public.tasks FOR DELETE
  USING (is_admin());

-- ============================================================
-- REPORTS
-- ============================================================
CREATE POLICY "reports_select"
  ON public.reports FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- Users insert their own reports only
CREATE POLICY "reports_insert"
  ON public.reports FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can edit own pending reports; admins edit any
CREATE POLICY "reports_update"
  ON public.reports FOR UPDATE
  USING (user_id = auth.uid() OR is_admin())
  WITH CHECK (user_id = auth.uid() OR is_admin());

CREATE POLICY "reports_delete"
  ON public.reports FOR DELETE
  USING (is_admin());

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE POLICY "achievements_select"
  ON public.achievements FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- Only admins issue achievements / certificates
CREATE POLICY "achievements_insert"
  ON public.achievements FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "achievements_update"
  ON public.achievements FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "achievements_delete"
  ON public.achievements FOR DELETE
  USING (is_admin());

-- ============================================================
-- WARNINGS
-- ============================================================
CREATE POLICY "warnings_select"
  ON public.warnings FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- Only admins issue warnings
CREATE POLICY "warnings_insert"
  ON public.warnings FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "warnings_update"
  ON public.warnings FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "warnings_delete"
  ON public.warnings FOR DELETE
  USING (is_admin());

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
-- Authenticated users see announcements addressed to them
CREATE POLICY "announcements_select"
  ON public.announcements FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      target = 'all'
      OR target_user_id = auth.uid()
      OR is_admin()
      OR (
        target_department IS NOT NULL
        AND target_department = (
          SELECT department FROM public.users WHERE id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "announcements_insert"
  ON public.announcements FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "announcements_update"
  ON public.announcements FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "announcements_delete"
  ON public.announcements FOR DELETE
  USING (is_admin());

-- ============================================================
-- ANNOUNCEMENT READS
-- ============================================================
-- Users see their own read receipts; admins see all
CREATE POLICY "ann_reads_select"
  ON public.announcement_reads FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- Users mark announcements as read for themselves only
CREATE POLICY "ann_reads_insert"
  ON public.announcement_reads FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
-- Public-flagged members visible to everyone; hidden members to admins
CREATE POLICY "team_members_select"
  ON public.team_members FOR SELECT
  USING (is_public = true OR is_admin());

CREATE POLICY "team_members_insert"
  ON public.team_members FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "team_members_update"
  ON public.team_members FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "team_members_delete"
  ON public.team_members FOR DELETE
  USING (is_admin());

-- ============================================================
-- NEWSLETTER
-- ============================================================
-- Anyone may subscribe
CREATE POLICY "newsletter_insert"
  ON public.newsletter FOR INSERT
  WITH CHECK (true);

-- Only admins view or manage the list
CREATE POLICY "newsletter_select"
  ON public.newsletter FOR SELECT
  USING (is_admin());

CREATE POLICY "newsletter_delete"
  ON public.newsletter FOR DELETE
  USING (is_admin());
