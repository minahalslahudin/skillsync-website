-- ============================================================
-- 001_initial_schema.sql
-- skillSYNC × skillIT — Complete database schema
-- ============================================================

-- ============================================================
-- USERS
-- Profile row linked 1-to-1 with auth.users
-- ============================================================
CREATE TABLE public.users (
  id            uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text        UNIQUE NOT NULL,
  full_name     text        NOT NULL,
  role          text        NOT NULL DEFAULT 'Volunteer',
  department    text,
  status        text        NOT NULL DEFAULT 'active',
  warning_count int         NOT NULL DEFAULT 0,
  is_admin      boolean     NOT NULL DEFAULT false,
  avatar_url    text,
  bio           text,
  linkedin      text,
  github        text,
  portfolio     text,
  joined_at     timestamptz NOT NULL DEFAULT now(),
  skills        text[]      NOT NULL DEFAULT '{}',
  CONSTRAINT users_role_check   CHECK (role   IN ('Volunteer','Intern','Lead','C-Suite','Admin')),
  CONSTRAINT users_status_check CHECK (status IN ('active','inactive','suspended'))
);

-- ============================================================
-- APPLICATIONS
-- Pre-account volunteer applications (public form)
-- ============================================================
CREATE TABLE public.applications (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           text        NOT NULL,
  email               text        NOT NULL,
  phone               text,
  city                text,
  university          text,
  semester            text,
  department_interest text,
  current_skills      text[]      NOT NULL DEFAULT '{}',
  motivation          text,
  can_commit          boolean,
  linkedin            text,
  github              text,
  portfolio           text,
  referral_source     text,
  applied_at          timestamptz NOT NULL DEFAULT now(),
  status              text        NOT NULL DEFAULT 'pending',
  admin_notes         text,
  CONSTRAINT applications_status_check CHECK (status IN ('pending','approved','rejected','waitlisted'))
);

-- ============================================================
-- EVENTS
-- Workshops, events, cohorts for both brands
-- ============================================================
CREATE TABLE public.events (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 text        NOT NULL,
  slug                  text        UNIQUE NOT NULL,
  description           text,
  date                  timestamptz,
  registration_deadline timestamptz,
  seats                 int,
  seats_taken           int         NOT NULL DEFAULT 0,
  type                  text        NOT NULL,
  brand                 text        NOT NULL DEFAULT 'skillsync',
  is_paid               boolean     NOT NULL DEFAULT false,
  price                 int         NOT NULL DEFAULT 0,
  is_published          boolean     NOT NULL DEFAULT false,
  form_schema           jsonb       NOT NULL DEFAULT '[]',
  created_at            timestamptz NOT NULL DEFAULT now(),
  tools_covered         text[]      NOT NULL DEFAULT '{}',
  resources_url         text,
  CONSTRAINT events_type_check  CHECK (type  IN ('workshop','event','cohort')),
  CONSTRAINT events_brand_check CHECK (brand IN ('skillsync','skillit')),
  CONSTRAINT events_price_check CHECK (price >= 0),
  CONSTRAINT events_seats_check CHECK (seats IS NULL OR seats > 0),
  CONSTRAINT events_seats_taken_check CHECK (seats_taken >= 0)
);

-- ============================================================
-- REGISTRATIONS
-- Event sign-ups; user_id nullable for non-auth registrations
-- ============================================================
CREATE TABLE public.registrations (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid        NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id       uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  form_data     jsonb       NOT NULL,
  registered_at timestamptz NOT NULL DEFAULT now(),
  status        text        NOT NULL DEFAULT 'registered',
  CONSTRAINT registrations_status_check CHECK (status IN ('registered','attended','cancelled','no_show'))
);

-- ============================================================
-- PROJECTS
-- Portfolio projects for both brands
-- ============================================================
CREATE TABLE public.projects (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text        NOT NULL,
  slug              text        UNIQUE NOT NULL,
  category          text,
  brand             text,
  short_description text,
  case_study        text,
  tech_tags         text[]      NOT NULL DEFAULT '{}',
  image_urls        text[]      NOT NULL DEFAULT '{}',
  is_ongoing        boolean     NOT NULL DEFAULT false,
  is_published      boolean     NOT NULL DEFAULT true,
  client_name       text,
  outcome_stats     jsonb,
  sort_order        int         NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- REVIEWS
-- Testimonials — require admin approval before display
-- ============================================================
CREATE TABLE public.reviews (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name       text        NOT NULL,
  reviewer_role       text,
  workshop_or_service text,
  rating              int         NOT NULL,
  body                text        NOT NULL,
  brand               text,
  is_approved         boolean     NOT NULL DEFAULT false,
  is_featured         boolean     NOT NULL DEFAULT false,
  photo_url           text,
  submitted_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)
);

-- ============================================================
-- TASKS
-- Work items assigned to volunteers
-- ============================================================
CREATE TABLE public.tasks (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  description     text,
  assigned_to     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_by     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  due_date        timestamptz,
  priority        text        NOT NULL DEFAULT 'medium',
  status          text        NOT NULL DEFAULT 'not_started',
  submission_text text,
  file_urls       text[]      NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz,
  CONSTRAINT tasks_priority_check CHECK (priority IN ('low','medium','high')),
  CONSTRAINT tasks_status_check   CHECK (status  IN ('not_started','in_progress','submitted','completed','overdue'))
);

-- ============================================================
-- REPORTS
-- Weekly work reports; entries is a JSON array of log items
-- ============================================================
CREATE TABLE public.reports (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  week_ending   date        NOT NULL,
  entries       jsonb       NOT NULL DEFAULT '[]',
  total_hours   numeric(5,2),
  status        text        NOT NULL DEFAULT 'pending',
  admin_comment text,
  submitted_at  timestamptz NOT NULL DEFAULT now(),
  reviewed_at   timestamptz,
  CONSTRAINT reports_status_check  CHECK (status IN ('pending','approved','rejected')),
  CONSTRAINT reports_hours_check   CHECK (total_hours IS NULL OR total_hours >= 0),
  UNIQUE (user_id, week_ending)
);

-- ============================================================
-- ACHIEVEMENTS
-- Certificates and milestones issued to volunteers
-- ============================================================
CREATE TABLE public.achievements (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            text        NOT NULL,
  title           text        NOT NULL,
  description     text,
  earned_at       timestamptz NOT NULL DEFAULT now(),
  certificate_url text,
  badge_icon      text,
  CONSTRAINT achievements_type_check CHECK (type IN ('certificate','milestone','award'))
);

-- ============================================================
-- WARNINGS
-- Formal warning log (max 3 per user)
-- ============================================================
CREATE TABLE public.warnings (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  warning_number int         NOT NULL,
  reason         text        NOT NULL,
  issued_by      uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  issued_at      timestamptz NOT NULL DEFAULT now(),
  notes          text,
  is_resolved    boolean     NOT NULL DEFAULT false,
  CONSTRAINT warnings_number_check CHECK (warning_number BETWEEN 1 AND 3)
);

-- ============================================================
-- ANNOUNCEMENTS
-- Internal notifications (all / role / department / user)
-- ============================================================
CREATE TABLE public.announcements (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text        NOT NULL,
  body              text        NOT NULL,
  target            text        NOT NULL DEFAULT 'all',
  target_department text,
  target_user_id    uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  sent_by           uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sent_at           timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ANNOUNCEMENT READS
-- Tracks which users have read which announcements
-- ============================================================
CREATE TABLE public.announcement_reads (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid        NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id         uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  read_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (announcement_id, user_id)
);

-- ============================================================
-- TEAM MEMBERS
-- Controls which users appear on the public /team page
-- ============================================================
CREATE TABLE public.team_members (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid    NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_public     boolean NOT NULL DEFAULT true,
  display_order int     NOT NULL DEFAULT 0,
  custom_title  text,
  UNIQUE (user_id)
);

-- ============================================================
-- NEWSLETTER
-- Email subscription list
-- ============================================================
CREATE TABLE public.newsletter (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text        UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- Cover common query patterns
-- ============================================================
CREATE INDEX idx_users_role          ON public.users(role);
CREATE INDEX idx_users_department    ON public.users(department);
CREATE INDEX idx_users_is_admin      ON public.users(is_admin);
CREATE INDEX idx_users_status        ON public.users(status);

CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_email  ON public.applications(email);
CREATE INDEX idx_applications_date   ON public.applications(applied_at DESC);

CREATE INDEX idx_events_slug         ON public.events(slug);
CREATE INDEX idx_events_type         ON public.events(type);
CREATE INDEX idx_events_brand        ON public.events(brand);
CREATE INDEX idx_events_published    ON public.events(is_published);
CREATE INDEX idx_events_date         ON public.events(date);

CREATE INDEX idx_registrations_event ON public.registrations(event_id);
CREATE INDEX idx_registrations_user  ON public.registrations(user_id);

CREATE INDEX idx_projects_slug       ON public.projects(slug);
CREATE INDEX idx_projects_brand      ON public.projects(brand);
CREATE INDEX idx_projects_published  ON public.projects(is_published);
CREATE INDEX idx_projects_order      ON public.projects(sort_order);

CREATE INDEX idx_reviews_brand       ON public.reviews(brand);
CREATE INDEX idx_reviews_approved    ON public.reviews(is_approved);
CREATE INDEX idx_reviews_featured    ON public.reviews(is_featured);

CREATE INDEX idx_tasks_assigned_to   ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_assigned_by   ON public.tasks(assigned_by);
CREATE INDEX idx_tasks_status        ON public.tasks(status);
CREATE INDEX idx_tasks_due_date      ON public.tasks(due_date);

CREATE INDEX idx_reports_user        ON public.reports(user_id);
CREATE INDEX idx_reports_week        ON public.reports(week_ending DESC);
CREATE INDEX idx_reports_status      ON public.reports(status);

CREATE INDEX idx_achievements_user   ON public.achievements(user_id);
CREATE INDEX idx_achievements_type   ON public.achievements(type);

CREATE INDEX idx_warnings_user       ON public.warnings(user_id);
CREATE INDEX idx_warnings_resolved   ON public.warnings(is_resolved);

CREATE INDEX idx_announcements_sent  ON public.announcements(sent_at DESC);
CREATE INDEX idx_announcements_tgt   ON public.announcements(target);

CREATE INDEX idx_ann_reads_user      ON public.announcement_reads(user_id);
CREATE INDEX idx_ann_reads_ann       ON public.announcement_reads(announcement_id);

CREATE INDEX idx_team_members_order  ON public.team_members(display_order);
CREATE INDEX idx_team_members_public ON public.team_members(is_public);
