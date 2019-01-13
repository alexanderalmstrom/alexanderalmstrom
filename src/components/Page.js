import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { connectComponent } from '../connect'

import Loading from './Loading'
import Image from './Image'

import './Page.scss'

class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false
    }
  }

  componentDidMount() {
    const { match } = this.props

    this.props.loadPage(match.params.slug)

    window.scrollTo(0, 0)
  }

  handleLodaded(e) {
    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 100)
  }

  render() {
    const { match, page } = this.props
    const entry = page.entry

    if (!entry || !entry.fields) return null

    const { isLoaded } = this.state

    return (
      <article className={`page ${isLoaded ? 'page--is-loaded' : ''}`}>
        {!this.props.page.fetching ? (
          <div className="container page-container">
            <Helmet>
              <title>
                {entry.fields.name} - {this.props.contentful.space.name}
              </title>
              <meta name="description" content={entry.fields.description} />
            </Helmet>
            <header className="page-header">
              <div className="page-image">
                {entry.fields.image ? (
                  <Image
                    image={entry.fields.image}
                    width={800}
                    onLoad={this.handleLodaded.bind(this)}
                  />
                ) : null}
              </div>
              <div className="page-content">
                <h1 className="page-title">
                  {entry.fields.title || entry.fields.name}
                </h1>
                <p className="page-text">{entry.fields.text}</p>
              </div>
            </header>
          </div>
        ) : (
          <Loading />
        )}
      </article>
    )
  }
}

Page.propTypes = {
  page: PropTypes.object,
  loadPage: PropTypes.func
}

export default connectComponent(Page)
