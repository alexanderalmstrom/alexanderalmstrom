import { createClient } from 'contentful'
import type { ContentfulClientApi, CreateClientParams } from 'contentful'
import qs from 'query-string'

type Client = ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'>

let client: Client | undefined

export function getClient() {
  if (client) return client

  const {
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    CONTENTFUL_ENVIRONMENT,
  } = import.meta.env

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    throw new Error('Contentful space id and access token is required in .env')
  }

  const config: CreateClientParams = {
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
    // Retries are handled by the query client instead.
    retryOnError: false,
    timeout: 10000,
  }

  if (CONTENTFUL_PREVIEW_ACCESS_TOKEN && isPreview()) {
    config.accessToken = CONTENTFUL_PREVIEW_ACCESS_TOKEN
    config.host = 'preview.contentful.com'
  } else {
    config.host = 'cdn.contentful.com'
  }

  if (CONTENTFUL_ENVIRONMENT) {
    config.environment = CONTENTFUL_ENVIRONMENT
  }

  client = createClient(config).withoutUnresolvableLinks

  return client
}

export function isPreview() {
  if (!import.meta.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) return false

  if (import.meta.env.DEV) return true

  if (import.meta.env.CONTENTFUL_PREVIEW == 'true') return true

  return Boolean(qs.parse(location.search).preview)
}
