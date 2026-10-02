import React from 'react'

import { connectComponent } from '../connect'

import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import Card from './Card'

import './Home.scss'

const DESCRIPTION =
  'Senior Frontend Engineer and UI/UX Designer from Stockholm, Sweden. I craft web and e-commerce solutions with attention to detail.'

class Home extends React.Component {
  componentDidMount() {
    this.props.loadProjects()
  }

  renderProjects() {
    const { projects } = this.props

    if (!projects) return null

    if (projects.fetching) return <Loading />

    return (
      <section className="projects">
        <div className="container projects-container">
          {projects && projects.entries
            ? Object.keys(projects.entries).map((id, index) => {
                return (
                  <Card
                    key={index}
                    basename="project"
                    entry={projects.entries[id]}
                  />
                )
              })
            : null}
        </div>
      </section>
    )
  }

  render() {
    return (
      <>
        <DocumentMeta
          title={`${this.props.contentful.space.name} - Senior Frontend Engineer / Designer`}
          description={DESCRIPTION}
        />
        {this.renderProjects()}
      </>
    )
  }
}

export default connectComponent(Home)
