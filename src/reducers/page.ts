import type { PageEntry } from '../types/contentful'
import { makeReducer } from './util'

export interface PageState {
  error?: boolean
  fetching?: boolean
  entry: Partial<PageEntry> & { fetching?: boolean }
}

export const page = makeReducer<PageState>(
  function (action) {
    switch (action.type) {
      case 'LOAD_PAGE_PENDING':
        return {
          entry: {
            fetching: true,
          },
        }

      case 'LOAD_PAGE_FULFILLED':
        action.payload.fetching = false

        return {
          fetching: false,
          entry: action.payload,
        }

      case 'LOAD_PAGE_REJECTED':
        return {
          error: true,
          fetching: false,
          entry: {},
        }
    }
  },
  { entry: {} },
)
