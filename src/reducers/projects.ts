import type { ProjectEntry } from '../types/contentful'
import { makeReducer } from './util'

export interface ProjectsState {
  error?: boolean
  fetching?: boolean
  entries: Record<string, ProjectEntry>
}

export const projects = makeReducer<ProjectsState>(
  function (action) {
    switch (action.type) {
      case 'LOAD_PROJECTS_PENDING':
        return {
          fetching: true,
        }

      case 'LOAD_PROJECTS_FULFILLED':
        return {
          fetching: false,
          entries: (action.payload as ProjectEntry[]).reduce<
            ProjectsState['entries']
          >((collection, entry) => {
            collection[entry.fields.slug] = entry
            return collection
          }, {}),
        }
      case 'LOAD_PROJECTS_REJECTED':
        return {
          error: true,
          fetching: false,
        }
    }
  },
  { entries: {} },
)
