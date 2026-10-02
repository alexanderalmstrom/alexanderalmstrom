import { useEffect } from 'react'

// Replaces react-helmet, which does not support React 19. React 19 can render
// <title> and <meta> directly, but it appends them rather than replacing the
// tags already in index.html, so the document is updated imperatively instead.
function setMetaContent(name, content) {
  if (!content) return

  let meta = document.head.querySelector(`meta[name="${name}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}

export default function DocumentMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])

  useEffect(() => {
    setMetaContent('description', description)
  }, [description])

  return null
}
