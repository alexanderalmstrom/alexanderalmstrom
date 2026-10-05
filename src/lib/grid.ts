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

// All in rem: the container's max width and side padding from sm up (see
// Container), and the side padding of an image column.
const CONTAINER_MAX = 100
const CONTAINER_PADDING = 9.5
const COLUMN_PADDING = 4

// The sizes attribute for an image that fills a column of the given size: the
// full viewport on small screens, then its share of the container minus the
// column's padding.
export function columnSizes(size: number = 12) {
  const share = (columns[size] ? size : 12) / 12
  const round = (value: number) => +value.toFixed(2)

  const capped = (CONTAINER_MAX - CONTAINER_PADDING) * share - COLUMN_PADDING
  const offset = CONTAINER_PADDING * share + COLUMN_PADDING

  return [
    `(min-width: ${CONTAINER_MAX}rem) ${round(capped)}rem`,
    `(min-width: 48rem) calc(${round(share * 100)}vw - ${round(offset)}rem)`,
    '100vw',
  ].join(', ')
}
