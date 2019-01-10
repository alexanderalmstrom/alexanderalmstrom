import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connectComponent } from '../connect'

import Logo from '../images/logo.svg'

import './Header.scss'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <header className="header">
        <div class="site-name">
          <span>{this.props.contentful.space.name}</span>
        </div>
        <div className="container">
          <Link className="site-brand" to="/">
            <Logo />
          </Link>
        </div>
      </header>
    )
  }
}

Header.propTypes = {}

export default connectComponent(Header)
