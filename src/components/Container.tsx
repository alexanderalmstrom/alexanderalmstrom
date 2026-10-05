import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

interface ContainerProps {
  children?: ReactNode
  className?: string
  // Containers nested inside another container drop the side padding.
  nested?: boolean
}

export default function Container({
  children,
  className,
  nested = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-400 flex-wrap',
        !nested && 'sm:pr-8 sm:pl-30',
        className,
      )}>
      {children}
    </div>
  )
}
