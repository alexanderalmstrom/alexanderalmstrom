import Container from './Container'
import DocumentMeta from './DocumentMeta'

export default function NotFound() {
  return (
    <Container className="mt-10">
      <DocumentMeta title="Page not found" />
      <div className="mx-auto w-10/12 flex-none px-8 text-center md:w-8/12 lg:w-6/12">
        <h1>Uh-Oh! Huston, We have a problem</h1>
        <p>We could not find what you were looking for.</p>
      </div>
    </Container>
  )
}
