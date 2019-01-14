import React from 'react'
import PropTypes from 'prop-types'

import { markdown } from '../services/helpers'

import './Column.scss'

class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { content } = entry.fields

    if (!content) return null

    return <div className="column" dangerouslySetInnerHTML={markdown(content)} />
  }
}

Column.propTypes = {
  entry: PropTypes.object
}

export default Column
