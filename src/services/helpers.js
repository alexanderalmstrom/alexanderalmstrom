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

export function createEvent(name, params) {
  params = params || { bubbles: false, cancelable: false, detail: undefined }

  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name, params)
  }

  const evt = document.createEvent('CustomEvent')
  evt.initCustomEvent(name, params.bubbles, params.cancelable, params.detail)

  return evt
}
