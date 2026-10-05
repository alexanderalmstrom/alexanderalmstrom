import type {
  ColumnSkeleton,
  ContentBlockEntry,
  ImageSkeleton,
} from '../types/contentful'
import { isEntryOf } from '../types/contentful'

import Column from './Column'
import Container from './Container'
import Image from './Image'

interface ContentBlockProps {
  entry?: ContentBlockEntry
  loading?: 'lazy' | 'eager'
}

export default function ContentBlock({ entry, loading }: ContentBlockProps) {
  if (!entry || !entry.fields) return null

  const { columns } = entry.fields

  // A block can stack several images, so only its first one loads eagerly.
  const eagerColumn =
    loading == 'eager'
      ? (columns ?? []).findIndex(
          (entry) => entry && isEntryOf<ImageSkeleton>(entry, 'image'),
        )
      : -1

  return (
    <div className="my-8 md:my-16">
      <Container nested>
        {columns
          ? columns.map((entry, index) => {
              if (!entry) return null

              if (isEntryOf<ColumnSkeleton>(entry, 'column')) {
                return <Column key={index} entry={entry} />
              }

              if (isEntryOf<ImageSkeleton>(entry, 'image')) {
                return (
                  <Image
                    key={index}
                    entry={entry}
                    loading={index == eagerColumn ? 'eager' : 'lazy'}
                  />
                )
              }

              return null
            })
          : null}
      </Container>
    </div>
  )
}
