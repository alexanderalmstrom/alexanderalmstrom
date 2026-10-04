import type { EntriesQueries, EntrySkeletonType } from 'contentful'

import { getClient } from './contentful'

// Field based queries cannot be checked against a generic skeleton, so the
// query objects are asserted instead.
type Query<Skeleton extends EntrySkeletonType> = EntriesQueries<
  Skeleton,
  'WITHOUT_UNRESOLVABLE_LINKS'
>

export function getEntries<Skeleton extends EntrySkeletonType>(
  content_type: Skeleton['contentTypeId'],
) {
  return getClient()
    .getEntries<Skeleton>({
      content_type: content_type,
      order: ['-fields.date'],
      include: 2,
    } as Query<Skeleton>)
    .then((payload) => {
      return payload.items
    })
}

export function getEntryBySlug<Skeleton extends EntrySkeletonType>(
  content_type: Skeleton['contentTypeId'],
  slug: string,
) {
  return getClient()
    .getEntries<Skeleton>({
      content_type: content_type,
      'fields.slug': slug,
      include: 2,
    } as Query<Skeleton>)
    .then((payload) => {
      if (!payload.items.length) {
        throw new Error('Entry not found')
      }

      return payload.items[0]
    })
}
