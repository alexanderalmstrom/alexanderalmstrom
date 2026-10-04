import { useProjects, useSpace } from '../hooks/queries'

import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import Card from './Card'
import Container from './Container'

const DESCRIPTION =
  'Senior Frontend Engineer and UI/UX Designer from Stockholm, Sweden. I craft web and e-commerce solutions with attention to detail.'

export default function Home() {
  const { data: projects = [], isPending } = useProjects()
  const { data: space } = useSpace()

  return (
    <>
      <DocumentMeta
        title={`${space?.name} - Senior Frontend Engineer / Designer`}
        description={DESCRIPTION}
      />
      {isPending ? (
        <Loading />
      ) : (
        <section>
          <Container>
            {projects.map((entry, index) => {
              return <Card key={index} basename="project" entry={entry} />
            })}
          </Container>
        </section>
      )}
    </>
  )
}
