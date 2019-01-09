import { createClient } from 'contentful'
import qs from 'query-string'

let client
let space
let auth
let query

export function initClient() {
  const config = {}

  if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
    config.space = process.env.CONTENTFUL_SPACE_ID
    config.accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  } else {
    throw new Error('Contentful space id and access token is required in .env')
  }

  if (isPreview()) {
    config.accessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    config.host = 'preview.contentful.com'
  } else {
    config.host = 'cdn.contentful.com'
  }

  if (process.env.CONTENTFUL_ENVIRONMENT) {
    config.environment = process.env.CONTENTFUL_ENVIRONMENT
  }

  client = createClient(config)

  space = client.getSpace().then(space => {
    auth = true
    return space
  })

  return space
}

export function getClient() {
  return auth && client
}

export function getSpace() {
  return auth && space
}

export function isPreview() {
  let preview = false

  if (!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) return

  if (process.env.NODE_ENV == 'development') preview = true

  if (
    process.env.CONTENTFUL_PREVIEW &&
    process.env.CONTENTFUL_PREVIEW == 'true'
  ) {
    preview = true
  }

  if (location.search) query = qs.parse(location.search)

  if (query && query.preview) preview = true

  return preview
}
