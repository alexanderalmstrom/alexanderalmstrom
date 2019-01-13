import React from 'react'
import PropTypes from 'prop-types'

import Column from './Column'

class Block extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { columns } = entry.fields

    return (
      <div className="content-block">
        {columns
          ? columns.map((entry, index) => {
              switch (entry.sys.contentType.sys.id) {
                case 'column':
                  return <Column key={index} entry={entry} />
                  break
                default:
                  return null
              }
            })
          : null}
      </div>
    )
  }
}

Block.propTypes = {
  entry: PropTypes.object
}

export default Block
