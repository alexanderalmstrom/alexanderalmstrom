/**
 * Recursive object extending, adapted from deep-extend (MIT, Viacheslav
 * Lotsmanov). Inlined because deep-extend branches on Node's `Buffer` global,
 * which webpack 5 no longer polyfills for the browser, and a Buffer can never
 * appear in this application's state.
 */
function isSpecificValue(val) {
  return val instanceof Date || val instanceof RegExp
}

function cloneSpecificValue(val) {
  if (val instanceof Date) return new Date(val.getTime())

  return new RegExp(val)
}

function deepCloneArray(arr) {
  return arr.map(item => {
    if (typeof item !== 'object' || item === null) return item

    if (Array.isArray(item)) return deepCloneArray(item)

    if (isSpecificValue(item)) return cloneSpecificValue(item)

    return deepExtend({}, item)
  })
}

function safeGetProperty(object, property) {
  return property === '__proto__' ? undefined : object[property]
}

export function deepExtend(target, ...sources) {
  if (typeof target !== 'object' || target === null) return false

  sources.forEach(source => {
    if (typeof source !== 'object' || source === null || Array.isArray(source)) {
      return
    }

    Object.keys(source).forEach(key => {
      const src = safeGetProperty(target, key)
      const val = safeGetProperty(source, key)

      // recursion prevention
      if (val === target) return

      if (typeof val !== 'object' || val === null) {
        target[key] = val
      } else if (Array.isArray(val)) {
        target[key] = deepCloneArray(val)
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val)
      } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = deepExtend({}, val)
      } else {
        target[key] = deepExtend(src, val)
      }
    })
  })

  return target
}

export function makeReducer(createUpdate, defaults = {}) {
  return function reduce(state, action) {
    const update = createUpdate(action)
    return deepExtend({}, state || defaults, update || {})
  }
}
