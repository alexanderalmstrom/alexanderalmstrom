import type { Space } from 'contentful'

import { makeReducer } from './util'

export type AuthState = 'loading' | 'success' | 'error'

export interface ContentfulState {
  authState: AuthState
  space?: Space
}

export const contentful = makeReducer<ContentfulState>(
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
