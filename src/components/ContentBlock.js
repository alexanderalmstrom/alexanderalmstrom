import React from 'react'

import Column from './Column'
import Image from './Image'

class Block extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { columns } = entry.fields

    return (
      <div className="block content-block">
        <div className="container">
          {columns
            ? columns.map((entry, index) => {
                switch (entry.sys.contentType.sys.id) {
                  case 'column':
                    return <Column key={index} entry={entry} />
                    break
                  case 'image':
                    return <Image key={index} entry={entry} />
                    break
                  default:
                    return null
                }
              })
            : null}
        </div>
      </div>
    )
  }
}

export default Block
