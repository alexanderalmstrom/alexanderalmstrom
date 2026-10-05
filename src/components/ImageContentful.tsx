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

  const { file } = image.fields
  const original = file.details.image

  // Contentful scales an image down to fit the requested size but never up.
  // Setting the resulting size on the img reserves its space before it loads,
  // so the page already has its full height when a scroll position is restored.
  const scale = original
    ? Math.min(1, width / original.width, height ? height / original.height : 1)
    : undefined

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
      <source type="image/webp" srcSet={`${file.url}?${webp}`} />
      <source type="image/jpeg" srcSet={`${file.url}?${jpg}&fl=progressive`} />
      <img
        src={`${file.url}?${jpg}&fl=progressive`}
        alt={image.fields.title}
        width={scale ? Math.round(original!.width * scale) : undefined}
        height={scale ? Math.round(original!.height * scale) : undefined}
        onLoad={onLoad}
      />
    </picture>
  )
}
