import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connectComponent } from '../connect'

import Image from './Image'

import './Card.scss'

class Card extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { entry, basename } = this.props

    if (!entry || !entry.fields) return null

    return (
      <div className="card">
        <Link to={`/${basename}/${entry.fields.slug}`} className="card-link">
          <div className="card-image">
            {entry.fields.image ? (
              <Image
                image={entry.fields.image}
                width={800}
              />
            ) : null}
          </div>
          <div className="card-content">
            <h2 className="card-name">{entry.fields.name}</h2>
          </div>
        </Link>
      </div>
    )
  }
}

Card.propTypes = {
  entry: PropTypes.object.isRequired,
  basename: PropTypes.string.isRequired
}

export default connectComponent(Card)
