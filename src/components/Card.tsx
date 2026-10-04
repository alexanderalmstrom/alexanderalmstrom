import { Link } from 'react-router-dom'

import { useLoaded } from '../hooks/useLoaded'
import { animateDown } from '../lib/animate'
import type { ProjectEntry } from '../types/contentful'

import ImageContentful from './ImageContentful'

interface CardProps {
  entry?: ProjectEntry
  basename: string
}

export default function Card({ entry, basename }: CardProps) {
  const [isLoaded, handleLoaded] = useLoaded()

  if (!entry || !entry.fields) return null

  return (
    <div
      className={`mb-6 w-full flex-none px-8 sm:w-6/12 sm:px-4 xl:mb-15 xl:px-8 ${animateDown(isLoaded)}`}>
      <Link
        to={`/${basename}/${entry.fields.slug}`}
        className="block no-underline hover:text-inherit">
        <div className="[&_img]:w-full">
          {entry.fields.image ? (
            <ImageContentful
              image={entry.fields.image}
              width={1170}
              onLoad={handleLoaded}
            />
          ) : null}
        </div>
        <div className="mt-3">
          <h2 className="mb-3 text-lg">{entry.fields.name}</h2>
        </div>
      </Link>
    </div>
  )
}
