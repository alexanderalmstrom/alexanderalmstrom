import type { ContentBlockEntry } from '../types/contentful'
import { isEntryOf } from '../types/contentful'

import ContentBlock from './ContentBlock'

interface BlockProps {
  entry?: ContentBlockEntry
}

export default function Block({ entry }: BlockProps) {
  if (!entry || !entry.fields) return null

  if (isEntryOf(entry, 'content_block')) return <ContentBlock entry={entry} />

  return null
}
