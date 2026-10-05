import { Fragment, useEffect, useState, useSyncExternalStore } from 'react'
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

// Seconds between the readouts, each line of the heading and the text
// under it starting to rise when the page opens.
const STAGGER = 0.08

const NOISE = '#%&/<>?*=+'

// The readouts that can come through as garbage, by their place in the
// row. The signal between them always reads as a percentage.
const CLOCK = 0
const SENSOR = 2

// What the oxygen sensor sends when it answers at all: nothing readable.
const CIPHER = '0123456789ABCDEFXZ#$&@?'

function scramble(characters: string, length: number) {
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)],
  ).join('')
}

function clock(seconds: number) {
  return [seconds / 3600, (seconds / 60) % 60, seconds % 60]
    .map((part) => String(Math.floor(part)).padStart(2, '0'))
    .join(':')
}

// Readouts from the mission that lost the page. The clock keeps running,
// the signal barely gets through and the oxygen sensor answers in code,
// and now and then one of the values comes through as garbage.
function Telemetry() {
  const [seconds, setSeconds] = useState(0)
  const [signal, setSignal] = useState(0)
  const [oxygen, setOxygen] = useState('--')
  const [noise, setNoise] = useState<Noise | null>(null)

  useEffect(() => {
    const tick = setInterval(() => {
      setSeconds((seconds) => seconds + 1)
      // Mostly nothing gets through, sometimes a trace of a signal, and
      // sometimes a code from the oxygen sensor.
      setSignal(Math.random() < 0.3 ? 1 + Math.floor(Math.random() * 2) : 0)
      setOxygen(Math.random() < 0.25 ? scramble(CIPHER, 2) : '--')
    }, 1000)

    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Interference starts on the clock or the sensor now and then, and
    // usually stays on it for a few moments with the garbage changing all
    // the while.
    const interference = setInterval(() => {
      setNoise((noise) =>
        Math.random() < (noise ? 0.7 : 0.05)
          ? {
              index: noise?.index ?? (Math.random() < 0.5 ? CLOCK : SENSOR),
              text: scramble(NOISE, 8),
            }
          : null,
      )
    }, 140)

    return () => clearInterval(interference)
  }, [])

  const readouts = [
    ['T+', clock(seconds)],
    ['Signal', `${signal}%`],
    ['O2', oxygen],
  ]

  return (
    <p className="mb-6 font-mono text-[0.8125rem] tracking-[0.2em] uppercase motion-safe:animate-glitch-flicker">
      {/* The first thing to rise in, through a mask of its own. */}
      <span className="block overflow-hidden">
        <span className="flex flex-wrap gap-x-6 gap-y-1 motion-safe:animate-rise">
          <span>Error 404</span>
          {readouts.map(([name, value], index) => (
            <span key={name} aria-hidden="true">
              {name}{' '}
              {noise?.index == index
                ? noise.text.slice(0, value.length)
                : value}
            </span>
          ))}
        </span>
      </span>
    </p>
  )
}

const lines = ['Uh-Oh! Houston,', 'We have a problem']

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

// The heading rises into place line by line when the page opens, like the
// heading of a hero. Each line rises through a mask that is taken away once
// it has arrived, so that the loose letters can leave it.
function Heading() {
  let place = 0

  return lines.map((line, index) => (
    <span key={index} className="block motion-safe:animate-unmask">
      <span
        className="block motion-safe:animate-rise"
        style={{ animationDelay: `${(index + 1) * STAGGER}s` }}>
        {line.split(' ').map((word, index) => {
          const start = place

          place += word.length + 1

          return (
            <Fragment key={start}>
              {index > 0 ? ' ' : null}
              {/* A loose letter is a box of its own, which would otherwise
                  let the word break in two at the end of a line. */}
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
        })}
      </span>
    </span>
  ))
}

const LIGHT = '(prefers-color-scheme: light)'

// Whether the visitor has the light theme, kept up to date if they switch.
function useLightTheme() {
  return useSyncExternalStore(
    (notify) => {
      const theme = window.matchMedia(LIGHT)

      theme.addEventListener('change', notify)

      return () => theme.removeEventListener('change', notify)
    },
    () => window.matchMedia(LIGHT).matches,
  )
}

export default function NotFound() {
  // Space is dark, so the sky is left out on the light theme. It is not
  // just hidden: its maps of the earth and the moon are never fetched.
  const light = useLightTheme()

  return (
    // Clipped sideways, so a letter that floats past the edge of the screen
    // does not make the page scroll.
    <div className="overflow-x-clip">
      <Container className="mt-10">
        <DocumentMeta title="Page not found" />
        {light ? null : (
          <Starfield className="pointer-events-none fixed inset-0 -z-1 size-full motion-safe:animate-dawn" />
        )}
        <div className="relative w-full flex-none px-8 lg:w-10/12 lg:px-16">
          <Telemetry />
          <h1 className="text-[3.25rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem]">
            <Glitch>
              <Heading />
            </Glitch>
          </h1>
          <p className="motion-safe:animate-glitch-flicker motion-safe:[animation-delay:-1.7s]">
            {/* Rises in after the heading, through a mask of its own; the
                padding keeps descenders from being cut. */}
            <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
              <span
                className="block motion-safe:animate-rise"
                style={{ animationDelay: `${(lines.length + 1) * STAGGER}s` }}>
                We could not find what you were looking for.
              </span>
            </span>
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
