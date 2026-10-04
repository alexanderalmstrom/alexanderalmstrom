import type { ReactEventHandler } from 'react'
import qs from 'query-string'

import type { ImageAsset } from '../types/contentful'

interface ImageContentfulProps {
  image?: ImageAsset
  format?: string
  quality?: number
  width?: number
  height?: number
  onLoad?: ReactEventHandler<HTMLImageElement>
}

export default function ImageContentful({
  image,
  format = 'jpg',
  quality = 90,
  width = 1280,
  height,
  onLoad,
}: ImageContentfulProps) {
  if (!image || !image.fields || !image.fields.file) return null

  const query = {
    fm: format,
    q: quality,
    w: width,
    h: height,
  }

  const jpg = qs.stringify(query)
  const webp = qs.stringify({ ...query, fm: 'webp' })

  return (
    <picture>
      <source type="image/webp" srcSet={`${image.fields.file.url}?${webp}`} />
      <source
        type="image/jpeg"
        srcSet={`${image.fields.file.url}?${jpg}&fl=progressive`}
      />
      <img
        src={`${image.fields.file.url}?${jpg}&fl=progressive`}
        alt={image.fields.title}
        onLoad={onLoad}
      />
    </picture>
  )
}
