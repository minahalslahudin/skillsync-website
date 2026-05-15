export const ROLES = ['Volunteer', 'Intern', 'Lead', 'C-Suite', 'Admin'] as const

export type Role = typeof ROLES[number]
