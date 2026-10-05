import { cn } from './cn'

// Full width on small screens, then a share of the 12 column grid. The sizes
// come from Contentful, so every class has to be spelled out for Tailwind to
// find it.
const columns: Record<number, string> = {
  1: 'sm:w-1/12',
  2: 'sm:w-2/12',
  3: 'sm:w-3/12',
  4: 'sm:w-4/12',
  5: 'sm:w-5/12',
  6: 'sm:w-6/12',
  7: 'sm:w-7/12',
  8: 'sm:w-8/12',
  9: 'sm:w-9/12',
  10: 'sm:w-10/12',
  11: 'sm:w-11/12',
  12: 'sm:w-full',
}

export function columnClass(size: number = 12) {
  return cn('w-full flex-none', columns[size] ?? columns[12])
}
