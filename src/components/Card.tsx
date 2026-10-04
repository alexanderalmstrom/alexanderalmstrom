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
      className={`mb-7.5 w-full flex-none px-7.5 sm:mb-15 sm:w-6/12 ${animateDown(isLoaded)}`}>
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
        <div className="mt-5">
          <h2 className="mb-2.5 text-[1rem] tracking-normal md:text-[1.125rem] lg:text-[1.25rem]">
            {entry.fields.name}
          </h2>
        </div>
      </Link>
    </div>
  )
}
