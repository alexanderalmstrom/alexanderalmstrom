import React from 'react'

import { connectComponent } from '../connect'

import DocumentMeta from './DocumentMeta'
import Loading from './Loading'
import Card from './Card'

import './Home.scss'

const DESCRIPTION =
  'Frontend Developer and Designer from Stockholm, Sweden. I create pixel perfect and toughtful UX design and techincal solutions to clients like Vässla, Kenza Zouiten and IvyRevel.'

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
          title={`${this.props.contentful.space.name} - Frontend Developer & Designer`}
          description={DESCRIPTION}
        />
        {this.renderProjects()}
      </>
    )
  }
}

export default connectComponent(Home)
