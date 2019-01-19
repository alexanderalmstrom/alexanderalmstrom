import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { connectComponent } from '../connect'

import Loading from './Loading'
import Image from './Image'
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
      <div className="project">
        {!this.props.projects.fetching ? (
          <div className="container project-container">
            <Helmet>
              <title>
                {entry.fields.name} - {this.props.contentful.space.name}
              </title>
              <meta name="description" content={entry.fields.description} />
            </Helmet>
            <header className="project-header">
              <div className="project-image">
                {entry.fields.image ? (
                  <Image
                    image={entry.fields.image}
                    width={800}
                  />
                ) : null}
              </div>
              <div className="project-content">
                <h1 className="project-name">{entry.fields.name}</h1>
                <p className="project-description">
                  {entry.fields.description}
                </p>
              </div>
            </header>
            <section className="product-section">
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
      </div>
    )
  }
}

Project.propTypes = {
  projects: PropTypes.object,
  loadProjects: PropTypes.func
}

export default connectComponent(Project)
