/**
 * Recursive object extending, adapted from deep-extend (MIT, Viacheslav
 * Lotsmanov). Inlined because deep-extend branches on Node's `Buffer` global,
 * which is not available in the browser, and a Buffer can never appear in this
 * application's state.
 */
type Dictionary = Record<string, unknown>

function isSpecificValue(val: unknown): val is Date | RegExp {
  return val instanceof Date || val instanceof RegExp
}

function cloneSpecificValue(val: Date | RegExp) {
  if (val instanceof Date) return new Date(val.getTime())

  return new RegExp(val)
}

function deepCloneArray(arr: unknown[]): unknown[] {
  return arr.map((item) => {
    if (typeof item !== 'object' || item === null) return item

    if (Array.isArray(item)) return deepCloneArray(item)

    if (isSpecificValue(item)) return cloneSpecificValue(item)

    return deepExtend({}, item)
  })
}

function safeGetProperty(object: Dictionary, property: string) {
  return property === '__proto__' ? undefined : object[property]
}

export function deepExtend(target: Dictionary, ...sources: unknown[]) {
  sources.forEach((source) => {
    if (
      typeof source !== 'object' ||
      source === null ||
      Array.isArray(source)
    ) {
      return
    }

    Object.keys(source).forEach((key) => {
      const src = safeGetProperty(target, key)
      const val = safeGetProperty(source as Dictionary, key)

      // recursion prevention
      if (val === target) return

      if (typeof val !== 'object' || val === null) {
        target[key] = val
      } else if (Array.isArray(val)) {
        target[key] = deepCloneArray(val)
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val)
      } else if (
        typeof src !== 'object' ||
        src === null ||
        Array.isArray(src)
      ) {
        target[key] = deepExtend({}, val)
      } else {
        target[key] = deepExtend(src as Dictionary, val)
      }
    })
  })

  return target
}

// Actions are dispatched as plain objects and expanded by
// redux-promise-middleware into _PENDING/_FULFILLED/_REJECTED variants.
export interface AppAction {
  type: string
  payload?: any
  meta?: any
}

export function makeReducer<State extends object>(
  createUpdate: (action: AppAction) => Partial<State> | undefined,
  defaults: State,
) {
  return function reduce(state: State | undefined, action: AppAction): State {
    const update = createUpdate(action)
    return deepExtend({}, state || defaults, update || {}) as State
  }
}
