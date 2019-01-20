import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { connectComponent } from '../connect'
import { markdown } from '../services/helpers'

import Loading from './Loading'
import ImageContentful from './ImageContentful'

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
        {!this.props.page.entry.fetching ? (
          <div className="container page-container">
            <Helmet>
              <title>
                {entry.fields.name} - {this.props.contentful.space.name}
              </title>
              <meta name="description" content={entry.fields.description} />
            </Helmet>
            <header className="page-header">
              {entry.fields.image ? (
                <div className="page-image">
                  <ImageContentful
                    image={entry.fields.image}
                    width={800}
                    onLoad={this.handleLodaded.bind(this)}
                  />
                </div>
              ) : null}
              <div className="page-content">
                {entry.fields.title ? (
                  <h1 className="page-title">{entry.fields.title}</h1>
                ) : null}
                <div
                  className="page-text"
                  dangerouslySetInnerHTML={markdown(entry.fields.text)}
                />
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
