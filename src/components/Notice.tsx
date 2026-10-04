interface NoticeProps {
  message?: string
}

export default function Notice({
  message = 'Something went wrong.',
}: NoticeProps) {
  return <div>{message}</div>
}
