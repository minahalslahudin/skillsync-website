export const DEPARTMENTS = [
  'CEO Office',
  'Growth & Brand',
  'Technology & Platform',
  'Operations Office',
] as const

export type Department = typeof DEPARTMENTS[number]
