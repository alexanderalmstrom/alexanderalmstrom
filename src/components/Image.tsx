import { useLoaded } from '../hooks/useLoaded'
import { animateDown } from '../lib/animate'
import { columnClass } from '../lib/grid'
import type { ImageEntry } from '../types/contentful'

import ImageContentful from './ImageContentful'

interface ImageProps {
  entry?: ImageEntry
}

function imageWidth(size?: number) {
  if (!size) return 1920

  if (size <= 6) return 960

  if (size <= 9) return 1280

  return 1920
}

export default function Image({ entry }: ImageProps) {
  const [isLoaded, handleLoaded] = useLoaded()

  if (!entry || !entry.fields) return null

  const { image, size } = entry.fields

  if (!image) return null

  return (
    <div
      className={`${columnClass(size)} sm:mb-7.5 sm:px-7.5 ${animateDown(isLoaded)}`}>
      <ImageContentful
        image={image}
        width={imageWidth(size)}
        onLoad={handleLoaded}
      />
    </div>
  )
}
