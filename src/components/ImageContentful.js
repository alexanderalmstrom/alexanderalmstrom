import React from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'

import './ImageContentful.scss'

class Image extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { image, ...rest } = this.props

    if (!image || !image.fields) return null

    const query = {
      fm: rest.format,
      q: rest.quality,
      w: rest.width,
      h: rest.height
    }

    const jpg = qs.stringify(query)
    const webp = qs.stringify(Object.assign(query, { fm: 'webp' }))

    return (
      <picture className="image-contentful">
        <source type="image/webp" srcSet={`${image.fields.file.url}?${webp}`} />
        <source
          type="image/jpeg"
          srcSet={`${image.fields.file.url}?${jpg}&fl=progressive`}
        />
        <img
          src={`${image.fields.file.url}?${jpg}&fl=progressive`}
          alt={image.fields.title}
          onLoad={this.props.onLoad}
        />
      </picture>
    )
  }
}

Image.defaultProps = {
  format: 'jpg',
  quality: 90,
  width: 1280
}

Image.propTypes = {
  image: PropTypes.object.isRequired,
  className: PropTypes.string,
  format: PropTypes.string,
  quality: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  onLoad: PropTypes.func
}

export default Image
