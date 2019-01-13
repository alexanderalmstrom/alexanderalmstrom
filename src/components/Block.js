import React from 'react'
import PropTypes from 'prop-types'

import ContentBlock from './ContentBlock'

class Block extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    return (
      <div className="blocks">
        {(() => {
          switch (entry.sys.contentType.sys.id) {
            case 'content_block':
              return <ContentBlock entry={entry} />
              break
            default:
              return null
          }
        })()}
      </div>
    )
  }
}

Block.propTypes = {
  entry: PropTypes.object
}

export default Block
