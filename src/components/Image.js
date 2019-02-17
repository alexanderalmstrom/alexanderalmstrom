import React from 'react'
import PropTypes from 'prop-types'

import { markdown } from '../services/helpers'

import ImageContentful from './ImageContentful'

import './Image.scss'

class Image extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false,
      width: 1920
    }
  }

  componentDidMount () {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { size } = entry.fields

    if (!size) return

    if (size <= 6) {
      this.setState({ width: 960 })
    } else if (size <= 9) {
      this.setState({ width: 1280 })
    }
  }

  handleLoaded() {
    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 100)
  }

  render() {
    const { entry } = this.props

    if (!entry || !entry.fields) return null

    const { image, size } = entry.fields

    if (!image) return null

    return (
      <div className={`image col-${size ? size : 12} ${this.state.isLoaded ? 'is-loaded' : ''}`}>
        <ImageContentful
          image={image}
          width={this.state.width}
          onLoad={this.handleLoaded.bind(this)}
        />
      </div>
    )
  }
}

Image.propTypes = {
  entry: PropTypes.object
}

export default Image
