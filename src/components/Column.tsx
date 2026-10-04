import { columnClass } from '../lib/grid'
import { markdown } from '../services/helpers'
import type { ColumnEntry } from '../types/contentful'

interface ColumnProps {
  entry?: ColumnEntry
}

export default function Column({ entry }: ColumnProps) {
  if (!entry || !entry.fields) return null

  const { content, size } = entry.fields

  if (!content) return null

  return (
    <div
      className={`${columnClass(size)} px-7.5`}
      dangerouslySetInnerHTML={markdown(content)}
    />
  )
}
