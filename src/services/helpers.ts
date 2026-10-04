import { marked } from 'marked'

export function markdown(content?: string) {
  if (!content) return undefined

  return {
    __html: marked.parse(content, {
      async: false,
      breaks: true,
    }),
  }
}

export function createEvent(
  name: string,
  params: CustomEventInit = {
    bubbles: false,
    cancelable: false,
    detail: undefined,
  },
) {
  return new CustomEvent(name, params)
}
