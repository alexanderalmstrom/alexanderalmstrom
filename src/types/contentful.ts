import type {
  Asset,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
} from 'contentful'

// The client is created with `withoutUnresolvableLinks`, so linked entries
// and assets are either resolved or missing.
type Modifiers = 'WITHOUT_UNRESOLVABLE_LINKS'

type Resolved<Skeleton extends EntrySkeletonType> = Entry<
  Skeleton,
  Modifiers,
  string
>

export type ColumnSkeleton = EntrySkeletonType<
  {
    content?: EntryFieldTypes.Text
    size?: EntryFieldTypes.Integer
  },
  'column'
>

export type ImageSkeleton = EntrySkeletonType<
  {
    image?: EntryFieldTypes.AssetLink
    size?: EntryFieldTypes.Integer
  },
  'image'
>

export type ContentBlockSkeleton = EntrySkeletonType<
  {
    columns?: EntryFieldTypes.Array<
      EntryFieldTypes.EntryLink<ColumnSkeleton | ImageSkeleton>
    >
  },
  'content_block'
>

export type ProjectSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    date?: EntryFieldTypes.Date
    description?: EntryFieldTypes.Text
    image?: EntryFieldTypes.AssetLink
    blocks?: EntryFieldTypes.Array<
      EntryFieldTypes.EntryLink<ContentBlockSkeleton>
    >
  },
  'project'
>

export type PageSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    title?: EntryFieldTypes.Symbol
    description?: EntryFieldTypes.Text
    text?: EntryFieldTypes.Text
    image?: EntryFieldTypes.AssetLink
  },
  'page'
>

export type ColumnEntry = Resolved<ColumnSkeleton>
export type ImageEntry = Resolved<ImageSkeleton>
export type ContentBlockEntry = Resolved<ContentBlockSkeleton>
export type ProjectEntry = Resolved<ProjectSkeleton>
export type PageEntry = Resolved<PageSkeleton>
export type ImageAsset = Asset<Modifiers, string>

export function isEntryOf<Skeleton extends EntrySkeletonType>(
  entry: Resolved<EntrySkeletonType>,
  contentTypeId: Skeleton['contentTypeId'],
): entry is Resolved<Skeleton> {
  return entry.sys.contentType.sys.id === contentTypeId
}
