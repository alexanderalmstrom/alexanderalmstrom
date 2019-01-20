import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { connectComponent } from '../connect'
import { markdown } from '../services/helpers'

import Loading from './Loading'
import ImageContentful from './ImageContentful'
import Block from './Block'

import './Project.scss'

class Project extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (!this.props.projects.entries.length) {
      this.props.loadProjects()
    }

    window.scrollTo(0, 0)
  }

  render() {
    const { match, projects } = this.props
    const entry = projects.entries[match.params.slug]

    if (!entry || !entry.fields) return null

    const { blocks } = entry.fields

    return (
      <article className="project">
        {!this.props.projects.fetching ? (
          <div className="container project-container">
            <Helmet>
              <title>
                {entry.fields.name} - {this.props.contentful.space.name}
              </title>
              <meta name="description" content={entry.fields.description} />
            </Helmet>
            <header className="project-header">
              <h1 className="project-name">{entry.fields.name}</h1>
              <div
                className="project-description"
                dangerouslySetInnerHTML={markdown(entry.fields.description)}
              />
              <a className="btn" href={entry.fields.url} target="_blank">Visit site</a>
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
          <Loading />
        )}
      </article>
    )
  }
}

Project.propTypes = {
  projects: PropTypes.object,
  loadProjects: PropTypes.func
}

export default connectComponent(Project)
