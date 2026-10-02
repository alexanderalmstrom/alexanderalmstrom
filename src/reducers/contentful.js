import { makeReducer } from './util'

export const contentful = makeReducer(
  function (action) {
    switch (action.type) {
      case 'LOADED_CONTENTFUL_FULFILLED':
        return {
          authState: action.meta.authState,
          space: action.payload,
        }
    }
  },
  { authState: 'loading' },
)
