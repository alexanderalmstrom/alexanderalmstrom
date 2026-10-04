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
}

export default function ContentBlock({ entry }: ContentBlockProps) {
  if (!entry || !entry.fields) return null

  const { columns } = entry.fields

  return (
    <div className="my-10 md:my-20">
      <Container nested>
        {columns
          ? columns.map((entry, index) => {
              if (!entry) return null

              if (isEntryOf<ColumnSkeleton>(entry, 'column')) {
                return <Column key={index} entry={entry} />
              }

              if (isEntryOf<ImageSkeleton>(entry, 'image')) {
                return <Image key={index} entry={entry} />
              }

              return null
            })
          : null}
      </Container>
    </div>
  )
}
