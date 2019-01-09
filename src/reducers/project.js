import { makeReducer } from './util'

export const project = makeReducer(
  function(action) {
    switch (action.type) {
      case 'LOAD_PRODUCT_PENDING':
        return {
          entry: {
            fetching: true,
            [action.meta.slug]: {}
          }
        }

      case 'LOAD_PRODUCT_FULFILLED':
        action.payload.fetching = false

        return {
          fetching: false,
          entry: {
            [action.meta.slug]: action.payload
          }
        }

      case 'LOAD_PRODUCT_REJECTED':
        return {
          error: true,
          fetching: false,
          entry: {}
        }
    }
  },
  { entry: [] }
)
