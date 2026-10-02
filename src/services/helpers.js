import { marked } from 'marked'

export function markdown(content) {
  if (!content) return null

  return {
    __html: marked.parse(content, {
      breaks: true,
    }),
  }
}

export function createEvent(name, params) {
  params = params || { bubbles: false, cancelable: false, detail: undefined }

  return new CustomEvent(name, params)
}
