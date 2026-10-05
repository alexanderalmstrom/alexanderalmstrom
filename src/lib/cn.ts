import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Joins conditional class names, then lets later Tailwind classes win over
// earlier ones that set the same property.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
