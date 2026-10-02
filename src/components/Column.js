import React from 'react'

import { markdown } from '../services/helpers'

import './Column.scss'

class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { content, size } = entry.fields

    if (!content) return null

    return (
      <div
        className={`column col-${size ? size : 12}`}
        dangerouslySetInnerHTML={markdown(content)}
      />
    )
  }
}

export default Column
