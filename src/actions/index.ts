import * as entryService from '../services/entry'
import * as contentfulService from '../services/contentful'
import type { AuthState } from '../reducers/contentful'
import type { PageSkeleton, ProjectSkeleton } from '../types/contentful'

export function setAppContentfulState(authState: AuthState) {
  return {
    type: 'LOADED_CONTENTFUL',
    payload: contentfulService.getSpace(),
    meta: {
      authState: authState,
    },
  }
}

export function setAppManagementState(authState: AuthState) {
  return {
    type: 'LOADED_MANAGEMENT',
    authState,
  }
}

export function loadProjects() {
  return {
    type: 'LOAD_PROJECTS',
    payload: entryService.getEntries<ProjectSkeleton>('project'),
  }
}

export function loadPage(slug: string) {
  return {
    type: 'LOAD_PAGE',
    payload: entryService.getEntryBySlug<PageSkeleton>('page', slug),
  }
}
