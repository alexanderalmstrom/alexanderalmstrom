import * as entryService from '../services/entry'
import * as contentfulService from '../services/contentful'

export function setAppContentfulState(authState) {
  return {
    type: 'LOADED_CONTENTFUL',
    payload: contentfulService.getSpace(),
    meta: {
      authState: authState
    }
  }
}

export function setAppManagementState(authState) {
  return {
    type: 'LOADED_MANAGEMENT',
    authState
  }
}

export function loadProjects() {
  return {
    type: 'LOAD_PROJECTS',
    payload: entryService.getEntries('project')
  }
}

export function loadPage(slug) {
  return {
    type: 'LOAD_PAGE',
    payload: entryService.getEntryBySlug('page', slug)
  }
}
