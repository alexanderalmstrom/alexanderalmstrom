import type { ReactNode } from 'react'

interface ContainerProps {
  children?: ReactNode
  className?: string
  // Containers nested inside another container drop the side padding.
  nested?: boolean
}

export default function Container({
  children,
  className = '',
  nested = false,
}: ContainerProps) {
  return (
    <div
      className={`mx-auto flex w-full max-w-360 flex-wrap ${
        nested ? '' : 'sm:pr-7.5 sm:pl-30'
      } ${className}`}>
      {children}
    </div>
  )
}
