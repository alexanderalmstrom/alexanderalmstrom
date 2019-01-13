import { makeReducer } from './util'

export const page = makeReducer(
  function(action) {
    switch (action.type) {
      case 'LOAD_PAGE_PENDING':
        return {
          entry: {
            fetching: true
          }
        }

      case 'LOAD_PAGE_FULFILLED':
        action.payload.fetching = false

        return {
          fetching: false,
          entry: action.payload
        }

      case 'LOAD_PAGE_REJECTED':
        return {
          error: true,
          fetching: false,
          entry: {}
        }
    }
  },
  { entry: [] }
)
