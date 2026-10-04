interface ImportMetaEnv {
  readonly CONTENTFUL_SPACE_ID?: string
  readonly CONTENTFUL_ACCESS_TOKEN?: string
  readonly CONTENTFUL_PREVIEW_ACCESS_TOKEN?: string
  readonly CONTENTFUL_PREVIEW?: string
  readonly CONTENTFUL_ENVIRONMENT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
