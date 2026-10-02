import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { connectComponent } from '../connect'
import * as contentfulService from '../services/contentful'
import { createEvent } from '../services/helpers'

import Layout from './Layout'
import Loading from './Loading'
import Notice from './Notice'
import NotFound from './NotFound'
import Home from './Home'
import Project from './Project'
import Page from './Page'

import './App.scss'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.appLoadedEvent = createEvent('APP_LOADED')
  }

  componentDidMount() {
    contentfulService
      .initClient()
      .then(
        () => this.props.setAppContentfulState('success'),
        () => this.props.setAppContentfulState('error')
      )
  }

  componentDidUpdate() {
    if (this.props.contentful.authState == 'success') {
      document.dispatchEvent(this.appLoadedEvent)
    }
  }

  render() {
    return (
      <div className="app">
        {this.props.contentful.authState == 'error' ? (
          <Notice message="Error when establishing connection with Contentful" />
        ) : null}
        {this.props.contentful.authState == 'success' ? (
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/:slug" element={<Project />} />
                <Route path="/page/:slug" element={<Page />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        ) : null}
        {this.props.contentful.authState == 'loading' ? <Loading /> : null}
      </div>
    )
  }
}

export default connectComponent(App)
