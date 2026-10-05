import type {
  BlockEntry,
  ContentBlockSkeleton,
  HeroSkeleton,
} from '../types/contentful'
import { isEntryOf } from '../types/contentful'

import ContentBlock from './ContentBlock'
import Hero from './Hero'

interface BlockProps {
  entry?: BlockEntry
  loading?: 'lazy' | 'eager'
}

export default function Block({ entry, loading }: BlockProps) {
  if (!entry || !entry.fields) return null

  if (isEntryOf<ContentBlockSkeleton>(entry, 'content_block')) {
    return <ContentBlock entry={entry} loading={loading} />
  }

  if (isEntryOf<HeroSkeleton>(entry, 'hero')) return <Hero entry={entry} />

  return null
}
