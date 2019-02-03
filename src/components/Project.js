import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { connectComponent } from '../connect'
import { markdown, createEvent } from '../services/helpers'

import Loading from './Loading'
import NotFound from './NotFound'
import ImageContentful from './ImageContentful'
import Block from './Block'

import './Project.scss'

class Project extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false
    }
  }

  componentWillMount () {
    const { projects } = this.props

    if (!Object.keys(projects.entries).length) {
      this.props.loadProjects()
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  handleLodaded(e) {
    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 100)
  }

  render() {
    const {
      match,
      projects: {
        error,
        fetching,
        entries
      }
    } = this.props

    if (fetching) return <Loading />

    const entry = entries[match.params.slug]

    if (!entry || error) return <NotFound />

    const { blocks } = entry.fields

    return (
      <article
        onLoad={this.handleLodaded.bind(this)}
        className={`project ${this.state.isLoaded ? 'is-loaded' : ''}`}>
        {entry && entry.fields ? (
          <div className="container project-container">
            <Helmet>
              <title>
                {entry.fields.name} - {this.props.contentful.space.name}
              </title>
              <meta name="description" content={entry.fields.description} />
            </Helmet>
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
            <footer className="project-footer">
              { entry.fields.url ? (
                <a className="btn" href={entry.fields.url} target="_blank">Visit site</a>
              ) : null }
            </footer>
          </div>
        ) : <NotFound /> }
      </article>
    )
  }
}

Project.propTypes = {
  projects: PropTypes.object,
  loadProjects: PropTypes.func
}

export default connectComponent(Project)
