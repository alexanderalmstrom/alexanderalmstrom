import { useEffect } from 'react'

import { loadProjects } from '../actions'
import { useAppDispatch, useAppSelector } from '../hooks/store'

import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import Card from './Card'
import Container from './Container'

const DESCRIPTION =
  'Senior Frontend Engineer and UI/UX Designer from Stockholm, Sweden. I craft web and e-commerce solutions with attention to detail.'

export default function Home() {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((state) => state.projects)
  const spaceName = useAppSelector((state) => state.contentful.space?.name)

  useEffect(() => {
    dispatch(loadProjects())
  }, [dispatch])

  return (
    <>
      <DocumentMeta
        title={`${spaceName} - Senior Frontend Engineer / Designer`}
        description={DESCRIPTION}
      />
      {projects.fetching ? (
        <Loading />
      ) : (
        <section>
          <Container>
            {Object.keys(projects.entries).map((id, index) => {
              return (
                <Card
                  key={index}
                  basename="project"
                  entry={projects.entries[id]}
                />
              )
            })}
          </Container>
        </section>
      )}
    </>
  )
}
