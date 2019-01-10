import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { connectComponent } from '../connect'

import Loading from './Loading'
import Image from './Image'

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

    return (
      <div className="container">
        {!this.props.projects.fetching ? (
          <article className="project">
            <Helmet>
              <title>
                {entry.fields.name} - {this.props.contentful.space.name}
              </title>
              <meta name="description" content={entry.fields.description} />
            </Helmet>
            <header className="project-header">
              <div className="project-image">
                {entry.fields.image ? (
                  <Image image={entry.fields.image} width={800} />
                ) : null}
              </div>
              <div className="project-content">
                <h1 className="project-name">{entry.fields.name}</h1>
                <p className="project-description">{entry.fields.description}</p>
              </div>
            </header>
            <section class="product-section">
              <div>
                
              </div>
            </section>
          </article>
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
