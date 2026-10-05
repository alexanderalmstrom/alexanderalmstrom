import { cn } from './cn'

// Content starts transparent and shifted up, then settles once loaded.
export function animateDown(isLoaded: boolean) {
  return cn(
    'transition-[translate,opacity] duration-600',
    isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0',
  )
}
