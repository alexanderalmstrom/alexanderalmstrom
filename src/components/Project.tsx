import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { loadProjects } from '../actions'
import { useAppDispatch, useAppSelector } from '../hooks/store'
import { useLoaded } from '../hooks/useLoaded'
import { animateDown } from '../lib/animate'

import Container from './Container'
import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import NotFound from './NotFound'
import Block from './Block'

export default function Project() {
  const { slug } = useParams()
  const dispatch = useAppDispatch()
  const { error, fetching, entries } = useAppSelector((state) => state.projects)
  const spaceName = useAppSelector((state) => state.contentful.space?.name)
  const [isLoaded, handleLoaded] = useLoaded()

  useEffect(() => {
    if (!Object.keys(entries).length) {
      dispatch(loadProjects())
    }

    window.scrollTo(0, 0)
    // Only on mount, as before the move to hooks.
  }, [])

  if (fetching) return <Loading />

  const entry = slug ? entries[slug] : undefined

  if (!entry || error) return <NotFound />

  const { blocks } = entry.fields

  return (
    <article
      onLoad={handleLoaded}
      className={`sm:mb-10 ${animateDown(isLoaded)}`}>
      <Container>
        <DocumentMeta
          title={`${entry.fields.name} - ${spaceName}`}
          description={entry.fields.description}
        />
        <header className="mt-10 w-full flex-none px-7.5 sm:mx-auto sm:w-8/12 sm:text-center">
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
