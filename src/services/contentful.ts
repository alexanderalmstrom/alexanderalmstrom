import { createClient } from 'contentful'
import type { ContentfulClientApi, CreateClientParams, Space } from 'contentful'
import qs from 'query-string'

type Client = ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'>

let client: Client | undefined
let space: Promise<Space> | undefined
let auth = false

export function initClient() {
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

  space = client.getSpace().then((space) => {
    auth = true
    return space
  })

  return space
}

export function getClient() {
  if (!auth || !client) throw new Error('Contentful client is not initialized')

  return client
}

export function getSpace() {
  return auth ? space : undefined
}

export function isPreview() {
  if (!import.meta.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) return false

  if (import.meta.env.DEV) return true

  if (import.meta.env.CONTENTFUL_PREVIEW == 'true') return true

  return Boolean(qs.parse(location.search).preview)
}
