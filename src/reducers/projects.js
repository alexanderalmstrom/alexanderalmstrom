import { makeReducer } from './util'

export const projects = makeReducer(
  function(action) {
    switch (action.type) {
      case 'LOAD_PROJECTS_PENDING':
        return {
          fetching: true
        }

      case 'LOAD_PROJECTS_FULFILLED':
        return {
          fetching: false,
          entries: action.payload.reduce((collection, entry) => {
            collection[entry.fields.slug] = entry
            return collection
          }, {})
        }
      case 'LOAD_PROJECTS_REJECTED':
        return {
          error: true,
          fetching: false
        }
    }
  },
  { entries: [] }
)
