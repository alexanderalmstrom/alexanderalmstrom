import React from 'react'

import { connectComponent } from '../connect'
import { withParams } from '../withParams'
import { markdown } from '../services/helpers'

import DocumentMeta from './DocumentMeta'
import NotFound from './NotFound'
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
    const { params } = this.props

    this.props.loadPage(params.slug)

    window.scrollTo(0, 0)
  }

  handleLodaded(e) {
    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 100)
  }

  render() {
    const {
      page: { error, entry }
    } = this.props

    if (error) return <NotFound />

    if (entry.fetching) return <Loading />

    return (
      <article className={`page ${this.state.isLoaded ? 'is-loaded' : ''}`}>
        {entry && entry.fields ? (
          <div className="container page-container">
            <DocumentMeta
              title={`${entry.fields.name} - ${this.props.contentful.space.name}`}
              description={entry.fields.description}
            />
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
          <NotFound />
        )}
      </article>
    )
  }
}

export default connectComponent(withParams(Page))
