import { Fragment } from 'react'

import { cn } from '../lib/cn'
import { columnSizes } from '../lib/grid'
import type { HeroEntry } from '../types/contentful'

import ImageContentful from './ImageContentful'

interface HeroProps {
  entry?: HeroEntry
}

// Seconds between each line or word starting to rise.
const STAGGER = 0.08

// A heading with line breaks animates line by line, otherwise word by word.
function splitHeading(heading: string) {
  const lines = heading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length > 1) return { parts: lines, byLine: true }

  return { parts: heading.trim().split(/\s+/), byLine: false }
}

export default function Hero({ entry }: HeroProps) {
  if (!entry || !entry.fields) return null

  const { asset, heading } = entry.fields
  const file = asset?.fields?.file
  const { parts, byLine } = splitHeading(heading ?? '')

  return (
    <div className="mb-10 w-full sm:px-8">
      <div className="relative flex min-h-[70svh] items-end overflow-hidden bg-black">
        {file?.contentType.startsWith('video/') ? (
          <video
            className="absolute inset-0 size-full object-cover"
            src={file.url}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div className="[&_img]:size-full [&_img]:object-cover [&_picture]:absolute [&_picture]:inset-0">
            <ImageContentful
              image={asset}
              width={1920}
              sizes={columnSizes()}
              loading="eager"
            />
          </div>
        )}
        {heading ? (
          <div className="relative w-full bg-linear-to-t from-black/60 to-transparent p-8 pt-24 md:p-12 md:pt-32">
            <h1 className="mb-0 text-white" aria-label={parts.join(' ')}>
              {parts.map((part, index) => (
                <Fragment key={index}>
                  {/* The outer span is the mask each line or word rises
                      through; the padding keeps descenders from being cut. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      '-mb-[0.15em] overflow-hidden pb-[0.15em]',
                      byLine ? 'block' : 'inline-block align-bottom',
                    )}>
                    <span
                      className={cn(
                        'motion-safe:animate-rise',
                        byLine ? 'block' : 'inline-block',
                      )}
                      style={{ animationDelay: `${index * STAGGER}s` }}>
                      {part}
                    </span>
                  </span>
                  {byLine ? null : ' '}
                </Fragment>
              ))}
            </h1>
          </div>
        ) : null}
      </div>
    </div>
  )
}
