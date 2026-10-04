import { useCallback, useEffect, useRef, useState } from 'react'

// Flags content as loaded shortly after its image has loaded, which triggers
// the fade-in transition (see lib/animate).
export function useLoaded() {
  const [isLoaded, setIsLoaded] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const handleLoaded = useCallback(() => {
    timeout.current = setTimeout(() => setIsLoaded(true), 100)
  }, [])

  return [isLoaded, handleLoaded] as const
}
