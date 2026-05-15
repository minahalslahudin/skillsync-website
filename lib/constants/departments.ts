export const DEPARTMENTS = [
  'CEO Office',
  'Finance & Revenue',
  'Growth & Brand',
  'Operations & Systems',
  'Technology & Platform',
] as const

export type Department = typeof DEPARTMENTS[number]
