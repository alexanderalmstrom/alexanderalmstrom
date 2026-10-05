import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useProjects, useSpace } from '../hooks/queries'
import { useLoaded } from '../hooks/useLoaded'
import { animateDown } from '../lib/animate'
import { cn } from '../lib/cn'

import Container from './Container'
import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import NotFound from './NotFound'
import Block from './Block'

export default function Project() {
  const { slug } = useParams()
  const { data: projects = [], isPending } = useProjects()
  const { data: space } = useSpace()
  const [isLoaded, handleLoaded] = useLoaded()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (isPending) return <Loading />

  const entry = projects.find((entry) => entry.fields.slug === slug)

  if (!entry) return <NotFound />

  const { blocks } = entry.fields

  return (
    <article
      onLoad={handleLoaded}
      className={cn('sm:mb-10', animateDown(isLoaded))}>
      <Container>
        <DocumentMeta
          title={`${entry.fields.name} - ${space?.name}`}
          description={entry.fields.description}
        />
        <header className="mt-10 w-full flex-none px-8 sm:mx-auto sm:w-8/12 sm:text-center">
          <h1 className="mb-0">{entry.fields.name}</h1>
        </header>
        <section className="[&_ul]:list-none [&_ul]:pl-0">
          {blocks
            ? blocks.map((entry, index) => {
                return <Block key={index} entry={entry} />
              })
            : null}
        </section>
      </Container>
    </article>
  )
}
