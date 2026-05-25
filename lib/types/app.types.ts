import type { Role } from '@/lib/constants/roles'
import type { Department } from '@/lib/constants/departments'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: Role
  department: Department | null
  status: 'active' | 'on_hold' | 'removed'
  is_admin: boolean
  joined_at: string
  bio: string | null
  linkedin: string | null
  github: string | null
  portfolio: string | null
  skills: string[]
  warning_count: number
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
  cv_url: string | null
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
  tech_tags: string[]
  live_url: string | null
  repo_url: string | null
  brand: string | null
  is_published: boolean
  is_ongoing: boolean
  sort_order: number
  created_at: string
  tagline: string | null
  builder_name: string | null
  builder_role: string | null
  tool: string | null
  industry: string | null
  problem_statement: string | null
  how_it_works: { title: string; description: string }[] | null
  key_features: { title: string; description: string }[] | null
  results: string[] | null
  tech_stack: { tool: string; role: string }[] | null
  time_saved: string | null
  money_saved: string | null
  project_type: string | null
}

export interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'number'
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
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
  status: 'not_started' | 'in_progress' | 'submitted' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  completed_at: string | null
  submission_text: string | null
  file_urls: string[]
  created_at: string
}

export interface ReportEntry {
  day:         string
  task_name:   string
  hours:       number
  deliverable: string
}

export interface Report {
  id:            string
  user_id:       string
  week_ending:   string
  entries:       ReportEntry[]
  total_hours:   number
  notes:         string | null
  status:        'pending' | 'approved' | 'rejected'
  admin_comment: string | null
  submitted_at:  string
  reviewed_at:   string | null
}

export interface Achievement {
  id: string
  user_id: string
  type: 'certificate' | 'milestone' | 'award'
  title: string
  description: string | null
  earned_at: string
  certificate_url: string | null
  badge_icon: string | null
}

export interface WorkshopRegistration {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  university: string
  semester: string
  skill_level: string
  reason: string
  committed: boolean
  referral_source: string
  payment_receipt_url: string | null
  workshop_id: string
  status: 'pending' | 'confirmed' | 'rejected'
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
  target: string
  target_department: string | null
  target_user_id: string | null
  sent_by: string
  sent_at: string
}
