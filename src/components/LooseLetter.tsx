import { useLayoutEffect, useRef } from 'react'

export interface Drift {
  // Pixels per second the letter floats at when left alone.
  x: number
  y: number
  // Degrees per second it turns at.
  spin: number
}

interface LooseLetterProps {
  children: string
  // Which letter of the heading this is, to find the gap it leaves from.
  place: number
  drift: Drift
}

// How quickly a throw loses its extra speed; higher is sooner.
const DRAG = 0.5

// A pointer that rested this many milliseconds before letting go was
// placing the letter, not throwing it.
const REST = 80

// The fastest a swing or a throw can set it spinning, in degrees per second.
const SPIN = 720

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value))
}

// A letter that has come loose from the heading. It floats off from the gap
// it left, and can be picked up, moved and thrown; there is nothing to stop
// it in space, so what leaves one edge of the screen comes back in from the
// opposite one. While held it hangs from the pointer and swings around it.
export default function LooseLetter({
  children,
  place,
  drift,
}: LooseLetterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    const gap = document.querySelector(`[data-loose="${place}"]`)

    if (!element || !gap) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cruise = still ? 0 : Math.hypot(drift.x, drift.y)
    const tumble = still ? 0 : drift.spin

    // It starts exactly where it stood in the heading.
    const home = gap.getBoundingClientRect()
    let x = home.left + home.width / 2
    let y = home.top + home.height / 2
    let vx = still ? 0 : drift.x
    let vy = still ? 0 : drift.y
    let angle = 0
    let spin = tumble

    // Where the letter is held: the pointer, how fast it moves, and the
    // spot under it measured from the letter's centre before rotation.
    let grip: { x: number; y: number } | null = null
    let pointer = { x: 0, y: 0, vx: 0, vy: 0 }
    let moved = 0
    let last = performance.now()
    let frame = 0

    // From the pointer to the letter's centre, at the current angle.
    function arm() {
      const radians = (angle * Math.PI) / 180
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)

      return {
        x: -(grip!.x * cos - grip!.y * sin),
        y: -(grip!.x * sin + grip!.y * cos),
      }
    }

    function draw(now: number) {
      const delta = Math.min((now - last) / 1000, 0.05)
      const ease = Math.exp(-DRAG * delta)

      last = now
      spin = tumble + (spin - tumble) * ease
      angle += spin * delta

      if (grip) {
        // The held spot stays under the pointer, so the rest turns around it.
        const { x: armX, y: armY } = arm()

        x = pointer.x + armX
        y = pointer.y + armY
      } else {
        const speed = Math.hypot(vx, vy)

        if (speed > cruise) {
          const slowed = Math.max(cruise, speed * ease) / speed

          vx *= slowed
          vy *= slowed
        }

        x += vx * delta
        y += vy * delta

        // Leave the screen completely before coming back on the other side.
        const margin = element!.offsetHeight
        const width = window.innerWidth + margin * 2
        const height = window.innerHeight + margin * 2

        x = ((((x + margin) % width) + width) % width) - margin
        y = ((((y + margin) % height) + height) % height) - margin
      }

      element!.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg)`
      frame = requestAnimationFrame(draw)
    }

    function grab(event: PointerEvent) {
      const radians = (-angle * Math.PI) / 180
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)
      const offsetX = event.clientX - x
      const offsetY = event.clientY - y

      element!.setPointerCapture(event.pointerId)
      grip = {
        x: offsetX * cos - offsetY * sin,
        y: offsetX * sin + offsetY * cos,
      }
      pointer = { x: event.clientX, y: event.clientY, vx: 0, vy: 0 }
      moved = event.timeStamp
    }

    function drag(event: PointerEvent) {
      if (!grip) return

      const delta = Math.max(event.timeStamp - moved, 1) / 1000
      const moveX = event.clientX - pointer.x
      const moveY = event.clientY - pointer.y
      const { x: armX, y: armY } = arm()

      // The letter lags behind the hand pulling it, which turns it around
      // the pointer. Held near its centre there is little to swing, so the
      // arm is never counted as shorter than 20 pixels.
      const length = Math.max(armX * armX + armY * armY, 400)
      const swing =
        ((-(armX * moveY - armY * moveX) / length / delta) * 180) / Math.PI

      // Average over the last few moves, since a single one is jittery.
      spin = clamp(spin * 0.7 + swing * 0.3, SPIN)
      pointer = {
        x: event.clientX,
        y: event.clientY,
        vx: pointer.vx * 0.6 + (moveX / delta) * 0.4,
        vy: pointer.vy * 0.6 + (moveY / delta) * 0.4,
      }
      moved = event.timeStamp
    }

    function release(event: PointerEvent) {
      if (!grip) return

      const { x: armX, y: armY } = arm()
      const turn = (spin * Math.PI) / 180

      // It leaves with the speed of the hand, plus that of its own swing.
      vx = -turn * armY
      vy = turn * armX

      if (event.timeStamp - moved <= REST) {
        vx += pointer.vx
        vy += pointer.vy
      }

      grip = null
    }

    element.addEventListener('pointerdown', grab)
    element.addEventListener('pointermove', drag)
    element.addEventListener('pointerup', release)
    element.addEventListener('pointercancel', release)
    draw(last)

    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointerdown', grab)
      element.removeEventListener('pointermove', drag)
      element.removeEventListener('pointerup', release)
      element.removeEventListener('pointercancel', release)
    }
  }, [place, drift])

  return (
    <span
      ref={ref}
      className="pointer-events-auto absolute top-0 left-0 block cursor-grab touch-none select-none active:cursor-grabbing">
      {children}
    </span>
  )
}
