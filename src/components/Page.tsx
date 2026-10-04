import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { usePage, useSpace } from '../hooks/queries'
import { useLoaded } from '../hooks/useLoaded'
import { animateDown } from '../lib/animate'
import { markdown } from '../services/helpers'

import Container from './Container'
import DocumentMeta from './DocumentMeta'
import NotFound from './NotFound'
import Loading from './Loading'
import ImageContentful from './ImageContentful'

export default function Page() {
  const { slug } = useParams()
  const { data: entry, isPending, isError } = usePage(slug)
  const { data: space } = useSpace()
  const [isLoaded, handleLoaded] = useLoaded()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (isError) return <NotFound />

  if (isPending) return <Loading />

  return (
    <article className="-mt-25 sm:mt-0 sm:mb-10">
      {entry.fields ? (
        <Container>
          <DocumentMeta
            title={`${entry.fields.name} - ${space?.name}`}
            description={entry.fields.description}
          />
          <header className="flex w-full flex-row-reverse flex-wrap items-center">
            {entry.fields.image ? (
              <div
                className={`mb-10 w-full flex-none sm:mb-0 sm:w-6/12 sm:px-8 md:w-4/12 [&_img]:w-full ${animateDown(isLoaded)}`}>
                <ImageContentful
                  image={entry.fields.image}
                  width={800}
                  onLoad={handleLoaded}
                />
              </div>
            ) : null}
            <div
              className={`w-full flex-none px-8 sm:w-6/12 md:w-8/12 ${animateDown(isLoaded)}`}>
              {entry.fields.title ? <h1>{entry.fields.title}</h1> : null}
              <div
                className="sm:pr-15"
                dangerouslySetInnerHTML={markdown(entry.fields.text)}
              />
            </div>
          </header>
        </Container>
      ) : (
        <NotFound />
      )}
    </article>
  )
}
