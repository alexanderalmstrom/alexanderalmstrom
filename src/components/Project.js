import React from 'react'

import { connectComponent } from '../connect'
import { withParams } from '../withParams'

import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import NotFound from './NotFound'
import Block from './Block'

import './Project.scss'

class Project extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false,
    }
  }

  componentDidMount() {
    const { projects } = this.props

    if (!Object.keys(projects.entries).length) {
      this.props.loadProjects()
    }

    window.scrollTo(0, 0)
  }

  handleLodaded(e) {
    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 100)
  }

  render() {
    const {
      params,
      projects: { error, fetching, entries },
    } = this.props

    if (fetching) return <Loading />

    const entry = entries[params.slug]

    if (!entry || error) return <NotFound />

    const { blocks } = entry.fields

    return (
      <article
        onLoad={this.handleLodaded.bind(this)}
        className={`project ${this.state.isLoaded ? 'is-loaded' : ''}`}>
        {entry && entry.fields ? (
          <div className="container project-container">
            <DocumentMeta
              title={`${entry.fields.name} - ${this.props.contentful.space.name}`}
              description={entry.fields.description}
            />
            <header className="project-header">
              <h1 className="project-name">{entry.fields.name}</h1>
            </header>
            <section className="project-section">
              {blocks
                ? blocks.map((entry, index) => {
                    return <Block key={index} entry={entry} />
                  })
                : null}
            </section>
          </div>
        ) : (
          <NotFound />
        )}
      </article>
    )
  }
}

export default connectComponent(withParams(Project))
