import React from 'react'
import { matchPath } from 'react-router'

import Header from './Header'
import Footer from './Footer'

import './Layout.scss'

class Layout extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="layout">
        <Header />
        <main className="main">{this.props.children}</main>
        <Footer />
      </div>
    )
  }
}

export default Layout
