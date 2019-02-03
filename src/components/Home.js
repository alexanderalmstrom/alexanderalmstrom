import React from 'react'
import PropTypes from 'prop-types'

import { connectComponent } from '../connect'

import Loading from './Loading'
import Card from './Card'

import './Home.scss'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.loadProjects()
  }

  render() {
    const { projects } = this.props

    if (!projects) return null

    if (projects.fetching) return <Loading />

    return (
      <section className="projects">
        <div className="container projects-container">
          {projects && projects.entries ? (
            Object.keys(projects.entries).map((id, index) => {
              return <Card key={index} basename="project" entry={projects.entries[id]} />
            })
          ) : null}
        </div>
      </section>
    )
  }
}

Home.propTypes = {
  projects: PropTypes.object,
  loadProjects: PropTypes.func
}

export default connectComponent(Home)
