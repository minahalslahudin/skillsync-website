import type { Role } from '@/lib/constants/roles'
import type { Department } from '@/lib/constants/departments'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: Role
  department: Department | null
  is_admin: boolean
  joined_at: string
  bio: string | null
  linkedin: string | null
  github: string | null
  portfolio: string | null
}

export interface Application {
  id: string
  full_name: string
  email: string
  phone: string | null
  city: string | null
  university: string | null
  semester: string | null
  department_interest: string | null
  current_skills: string[]
  motivation: string | null
  can_commit: boolean | null
  linkedin: string | null
  github: string | null
  portfolio: string | null
  referral_source: string | null
  applied_at: string
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
  admin_notes: string | null
}

export interface Event {
  id: string
  title: string
  slug: string
  type: 'workshop' | 'event' | 'cohort'
  description: string
  content: string | null
  cover_image: string | null
  start_date: string
  end_date: string | null
  location: string | null
  is_online: boolean
  is_published: boolean
  registration_open: boolean
  max_capacity: number | null
  form_schema: Record<string, unknown> | null
  created_at: string
  seats: number | null
  seats_taken: number
  date: string
  is_paid: boolean
  price: number
  registration_deadline: string | null
  tools_covered: string[]
  resources_url: string | null
  brand: string | null
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  short_description: string | null
  content: string | null
  cover_image: string | null
  image_urls: string[]
  category: string | null
  tags: string[]
  tech_tags: string[]
  live_url: string | null
  repo_url: string | null
  brand: string | null
  is_published: boolean
  is_ongoing: boolean
  created_at: string
}

export interface Review {
  id: string
  reviewer_name: string
  reviewer_role: string | null
  workshop_or_service: string | null
  rating: number
  body: string
  brand: string | null
  is_approved: boolean
  is_featured: boolean
  photo_url: string | null
  submitted_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  assigned_to: string
  assigned_by: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  completed_at: string | null
  created_at: string
}

export interface ReportEntry {
  date: string
  hours: number
  description: string
}

export interface Report {
  id: string
  user_id: string
  week_start: string
  week_end: string
  entries: ReportEntry[]
  total_hours: number
  notes: string | null
  submitted_at: string
}

export interface Achievement {
  id: string
  user_id: string
  title: string
  type: 'certificate' | 'milestone' | 'award'
  description: string | null
  issued_at: string
  certificate_url: string | null
}

export interface Warning {
  id: string
  user_id: string
  issued_by: string
  reason: string
  severity: 'minor' | 'major' | 'final'
  issued_at: string
  acknowledged_at: string | null
}

export interface Announcement {
  id: string
  title: string
  body: string
  audience: 'all' | Role
  is_pinned: boolean
  created_by: string
  created_at: string
}
