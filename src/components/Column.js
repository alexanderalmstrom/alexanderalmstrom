import React from 'react'
import PropTypes from 'prop-types'

class Column extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { content } = entry.fields

    return <div className="column">{content}</div>
  }
}

Column.propTypes = {
  entry: PropTypes.object
}

export default Column
