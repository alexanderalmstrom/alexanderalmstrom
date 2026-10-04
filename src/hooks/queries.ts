import { useQuery } from '@tanstack/react-query'

import { getClient } from '../services/contentful'
import * as entryService from '../services/entry'
import type { PageSkeleton, ProjectSkeleton } from '../types/contentful'

export function useSpace() {
  return useQuery({
    queryKey: ['space'],
    queryFn: () => getClient().getSpace(),
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => entryService.getEntries<ProjectSkeleton>('project'),
  })
}

export function usePage(slug?: string) {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: () => entryService.getEntryBySlug<PageSkeleton>('page', slug!),
    enabled: Boolean(slug),
  })
}
