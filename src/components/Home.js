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

  componentDidMount() {
    this.props.loadProjects()
  }

  render() {
    const { entries } = this.props.projects

    return (
      <div className="home">
        <div className="container projects-container">
          {entries ? (
            Object.keys(entries).map((id, index) => {
              return <Card key={index} basename="project" entry={entries[id]} />
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  projects: PropTypes.object,
  loadProjects: PropTypes.func
}

export default connectComponent(Home)
