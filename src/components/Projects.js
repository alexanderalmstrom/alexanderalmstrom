import React from 'react'
import PropTypes from 'prop-types'

import { connectComponent } from '../connect'

import Loading from './Loading'
import Card from './Card'

import './Projects.scss'

class Projects extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.loadProjects()
  }

  render() {
    const { entries } = this.props.projects

    return (
      <div className="container">
        <div className="projects">
          {entries ? (
            Object.keys(entries).map((id, index) => {
              return <Card key={index} entry={entries[id]} />
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>
    )
  }
}

Projects.propTypes = {
  projects: PropTypes.object,
  loadProjects: PropTypes.func
}

export default connectComponent(Projects)
