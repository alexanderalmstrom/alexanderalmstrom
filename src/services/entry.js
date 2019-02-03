import { getClient } from './contentful'

export function getEntries(content_type) {
  return getClient()
    .getEntries({
      content_type: content_type,
      order: '-fields.date',
      include: 2
    })
    .then(payload => {
      return payload.items
    })
}

export function getEntryBySlug(content_type, slug) {
  return getClient()
    .getEntries({
      content_type: content_type,
      'fields.slug': slug,
      include: 2
    })
    .then(payload => {
      if (!payload.items.length) {
        throw new Error('Entry not found')
      }

      return payload.items[0]
    })
}
