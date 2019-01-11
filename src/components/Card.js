import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connectComponent } from '../connect'

import Image from './Image'

import './Card.scss'

class Card extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false
    }
  }

  componentDidMount() {}

  handleLoaded(e) {
    this.setState({ isLoaded: true })
  }

  render() {
    const { entry, basename } = this.props

    const { isLoaded } = this.state

    return (
      <div className={`card ${isLoaded ? 'card--is-loaded' : ''}`}>
        <Link to={`/${basename}/${entry.fields.slug}`} className="card-link">
          <div className="card-image">
            {entry.fields.image ? (
              <Image
                image={entry.fields.image}
                width={800}
                onLoad={this.handleLoaded.bind(this)}
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
