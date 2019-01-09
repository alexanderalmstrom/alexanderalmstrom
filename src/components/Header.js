import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connectComponent } from '../connect'

import './Header.scss'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <header className="header">
        <div className="container">
          <div className="site-brand">
            <Link className="site-brand-link" to="/">
              {this.props.contentful.space.name}
            </Link>
          </div>
        </div>
      </header>
    )
  }
}

Header.propTypes = {}

export default connectComponent(Header)
