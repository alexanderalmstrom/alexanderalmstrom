interface LoadingProps {
  message?: string
}

export default function Loading({ message = 'Loading' }: LoadingProps) {
  return (
    <div className="fixed top-0 left-0 flex size-full items-center justify-center text-center text-foreground">
      <div className="flex flex-col items-center justify-center">
        <i className="flex items-center justify-center after:block after:size-0 after:origin-[8px_6px] after:animate-loading-spin after:border-x-8 after:border-y-16 after:border-transparent after:border-t-foreground after:content-['']" />
        <p className="hidden text-[0.875rem]">{message}</p>
      </div>
    </div>
  )
}
