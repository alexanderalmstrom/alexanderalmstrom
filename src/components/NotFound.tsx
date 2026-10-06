import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

import Container from './Container'
import DocumentMeta from './DocumentMeta'
import LooseLetter from './LooseLetter'
import type { Drift } from './LooseLetter'
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
        <span className="flex flex-wrap sm:gap-x-6 gap-y-1 motion-safe:animate-rise max-sm:text-xs">
          <span className='max-sm:basis-1/2'>Error 404</span>
          {readouts.map(([name, value], index) => (
            <span key={name} className="max-sm:basis-1/2" aria-hidden="true">
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
const text = lines.join(' ')

// Nothing holds the letters down out here, so two of them have come loose:
// the e in have and the m in problem. By their place in the heading, how
// each one floats and turns when left alone.
const loose: Record<number, Drift> = {
  22: { x: 0.3, y: 1.4, spin: 1.2 },
  32: { x: 0.9, y: 0.8, spin: -1.4 },
}

interface HeadingProps {
  // Whether the loose letters have left, so that only their gaps remain.
  released: boolean
}

// The heading rises into place line by line when the page opens, like the
// heading of a hero: each line rises through a mask, and the padding keeps
// descenders from being cut.
function Heading({ released }: HeadingProps) {
  let place = 0

  return lines.map((line, index) => (
    <span
      key={index}
      className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
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
                {[...word].map((letter, offset) =>
                  loose[start + offset] ? (
                    // The letter stays here unseen once it has left, so that
                    // the word keeps its gap and still reads the same aloud.
                    <span
                      key={offset}
                      data-loose={start + offset}
                      className={cn('inline-block', released && 'opacity-0')}>
                      {letter}
                    </span>
                  ) : (
                    letter
                  ),
                )}
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
  const [released, setReleased] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)

  // The loose letters let go of the heading once it has risen into place.
  // That is waited for rather than timed, since a page opened in a tab in
  // the background does not animate until it is looked at.
  useEffect(() => {
    let gone = false
    const rising = (
      heading.current?.getAnimations({ subtree: true }) ?? []
    ).filter(
      (animation) =>
        animation instanceof CSSAnimation && animation.animationName == 'rise',
    )

    Promise.all(rising.map((animation) => animation.finished)).then(
      () => {
        if (!gone) setReleased(true)
      },
      // An animation that was cancelled means the page is going away.
      () => {},
    )

    return () => {
      gone = true
    }
  }, [])

  return (
    <Container className="mt-10">
      <DocumentMeta title="Page not found" />
      {light ? null : (
        <Starfield className="pointer-events-none fixed inset-0 -z-1 size-full motion-safe:animate-dawn" />
      )}
      <div className="relative w-full flex-none px-8 lg:w-10/12 lg:px-16">
        <Telemetry />
        <h1
          ref={heading}
          className="text-[3.25rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem]">
          <Glitch>
            <Heading released={released} />
          </Glitch>
          {/* The loose letters float over the whole screen. They are kept
                in the heading so that they look like the rest of it, but
                fixed to the screen so that they can leave it without making
                the page scroll. */}
          {released ? (
            <span
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
              {Object.entries(loose).map(([place, drift]) => (
                <LooseLetter key={place} place={Number(place)} drift={drift}>
                  {text[Number(place)]}
                </LooseLetter>
              ))}
            </span>
          ) : null}
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
  )
}
