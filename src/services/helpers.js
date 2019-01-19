import Marked from 'marked'

export function markdown(content) {
  if (!content) return null

  return {
    __html: Marked(content, {
      sanitize: false,
      breaks: true
    })
  }
}
