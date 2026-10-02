import React from 'react'

import ContentBlock from './ContentBlock'

import './Block.scss'

class Block extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    return (
      <>
        {(() => {
          switch (entry.sys.contentType.sys.id) {
            case 'content_block':
              return <ContentBlock entry={entry} />
              break
            default:
              return null
          }
        })()}
      </>
    )
  }
}

export default Block
