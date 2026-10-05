import { Fragment, useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '../lib/cn'

import Container from './Container'
import DocumentMeta from './DocumentMeta'
import Starfield from './Starfield'

interface GlitchProps {
  children: ReactNode
}

interface Noise {
  // Which readout is showing garbage.
  index: number
  text: string
}

// A copy of the text that covers a horizontal slice of the original and is
// pushed sideways, so the line looks torn. It is opaque to hide the slice it
// replaces, and its coloured shadow is the misaligned colour channel.
const slice =
  'pointer-events-none absolute inset-0 hidden bg-background select-none motion-safe:block'

// Text that breaks up in short bursts, like a screen losing its signal.
function Glitch({ children }: GlitchProps) {
  return (
    <span className="relative block motion-safe:animate-glitch-shake">
      {children}
      <span
        aria-hidden="true"
        className={cn(
          slice,
          'animate-glitch-top [text-shadow:-0.02em_0_#f0f]',
        )}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          slice,
          'animate-glitch-bottom [text-shadow:0.02em_0_#0ff]',
        )}>
        {children}
      </span>
    </span>
  )
}

// The mission clock starts at 00:04:04.
const LIFTOFF = 244

const NOISE = '#%&/<>?*=+'

function clock(seconds: number) {
  return [seconds / 3600, (seconds / 60) % 60, seconds % 60]
    .map((part) => String(Math.floor(part)).padStart(2, '0'))
    .join(':')
}

// Readouts from the mission that lost the page. The clock keeps running,
// and now and then one of the values comes through as garbage.
function Telemetry() {
  const [seconds, setSeconds] = useState(LIFTOFF)
  const [noise, setNoise] = useState<Noise | null>(null)

  useEffect(() => {
    const tick = setInterval(() => setSeconds((seconds) => seconds + 1), 1000)

    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interference = setInterval(() => {
      setNoise(
        Math.random() < 0.04
          ? {
              index: Math.floor(Math.random() * 3),
              text: Array.from(
                { length: 8 },
                () => NOISE[Math.floor(Math.random() * NOISE.length)],
              ).join(''),
            }
          : null,
      )
    }, 140)

    return () => clearInterval(interference)
  }, [])

  const readouts = [
    ['T+', clock(seconds)],
    ['Signal', '0%'],
    ['O2', '--'],
  ]

  return (
    <p className="mb-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.8125rem] tracking-[0.2em] uppercase motion-safe:animate-glitch-flicker">
      <span>Error 404</span>
      {readouts.map(([name, value], index) => (
        <span key={name} aria-hidden="true">
          {name}{' '}
          {noise?.index == index ? noise.text.slice(0, value.length) : value}
        </span>
      ))}
    </p>
  )
}

const HEADING = 'Uh-Oh! Houston, We have a problem'

// Nothing holds the letters down out here, so a few of them have come
// loose. By their place in the heading: how far each one floats off, how
// much it turns on the way, and the seconds it takes to get there and back.
const loose: Record<
  number,
  { x: string; y: string; turn: string; time: number }
> = {
  3: { x: '11vw', y: '-11vh', turn: '-40deg', time: 420 },
  12: { x: '14vw', y: '-6vh', turn: '95deg', time: 480 },
  21: { x: '6vw', y: '16vh', turn: '60deg', time: 380 },
  28: { x: '18vw', y: '12vh', turn: '-120deg', time: 500 },
  32: { x: '26vw', y: '4vh', turn: '35deg', time: 450 },
}

function Letters() {
  let place = 0

  return HEADING.split(' ').map((word, index) => {
    const start = place

    place += word.length + 1

    return (
      <Fragment key={start}>
        {index > 0 ? ' ' : null}
        {/* A loose letter is a box of its own, which would otherwise let
            the word break in two at the end of a line. */}
        <span className="whitespace-nowrap">
          {[...word].map((letter, offset) => {
            const drift = loose[start + offset]

            return drift ? (
              <span
                key={offset}
                className="inline-block motion-safe:animate-drift"
                style={
                  {
                    '--drift-x': drift.x,
                    '--drift-y': drift.y,
                    '--drift-turn': drift.turn,
                    animationDuration: `${drift.time}s`,
                  } as CSSProperties
                }>
                {letter}
              </span>
            ) : (
              letter
            )
          })}
        </span>
      </Fragment>
    )
  })
}

export default function NotFound() {
  return (
    // Clipped sideways, so a letter that floats past the edge of the screen
    // does not make the page scroll.
    <div className="overflow-x-clip">
      <Container className="mt-10">
        <DocumentMeta title="Page not found" />
        <Starfield className="pointer-events-none fixed inset-0 -z-1 size-full" />
        <div className="relative w-full flex-none px-8 lg:w-10/12 lg:px-16">
          <Telemetry />
          <h1 className="text-[3.25rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem]">
            <Glitch>
              <Letters />
            </Glitch>
          </h1>
          <p className="motion-safe:animate-glitch-flicker motion-safe:[animation-delay:-1.7s]">
            We could not find what you were looking for.
          </p>
          {/* A thin line that inverts whatever it crosses, like a row of the
            screen that failed to draw. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 hidden h-0.5 bg-white mix-blend-difference motion-safe:block motion-safe:animate-glitch-tear"
          />
        </div>
      </Container>
    </div>
  )
}
