import React from 'react'
import PropTypes from 'prop-types'

import { markdown } from '../services/helpers'

import ImageContentful from './ImageContentful'

import './Image.scss'

class Image extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { image } = entry.fields

    if (!image) return null

    return (
      <div className="image">
        <ImageContentful
          image={image}
          width={1280} />
      </div>
    )
  }
}

Image.propTypes = {
  entry: PropTypes.object
}

export default Image
