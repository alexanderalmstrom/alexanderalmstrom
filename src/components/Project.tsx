import { useParams } from 'react-router-dom'

import { useProjects, useSpace } from '../hooks/queries'
import { firstImageBlock } from '../lib/blocks'

import Container from './Container'
import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import NotFound from './NotFound'
import Block from './Block'

export default function Project() {
  const { slug } = useParams()
  const { data: projects = [], isPending } = useProjects()
  const { data: space } = useSpace()

  if (isPending) return <Loading />

  const entry = projects.find((entry) => entry.fields.slug === slug)

  if (!entry) return <NotFound />

  const { blocks } = entry.fields
  const eagerBlock = firstImageBlock(blocks)

  return (
    <article className="sm:mb-10">
      <Container>
        <DocumentMeta
          title={`${entry.fields.name} - ${space?.name}`}
          description={entry.fields.description}
        />
        <header className="mt-10 w-full flex-none px-8 motion-safe:animate-settle sm:text-center">
          <h1 className="mb-0 xl:text-8xl">{entry.fields.name}</h1>
        </header>
        <section className="[&_ul]:list-none [&_ul]:pl-0">
          {blocks
            ? blocks.map((entry, index) => {
                // The first images are near the top of the page, so they
                // should not wait for lazy loading.
                return (
                  <Block
                    key={index}
                    entry={entry}
                    loading={index == eagerBlock ? 'eager' : 'lazy'}
                  />
                )
              })
            : null}
        </section>
      </Container>
    </article>
  )
}
