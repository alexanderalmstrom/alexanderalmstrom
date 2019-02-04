import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'

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

  componentWillMount() {
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
            <Helmet>
              <title>
                {this.props.contentful.space.name} - Frontend Developer &
                Designer
              </title>
              <meta
                name="description"
                content="Frontend Developer and Designer from Stockholm, Sweden. I create pixel perfect and toughtful UX design and techincal solutions to clients like Vässla, Kenza Zouiten and IvyRevel."
              />
            </Helmet>
            <Layout>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/project/:slug" component={Project} />
                <Route path="/page/:slug" component={Page} />
                <Route path="*" component={NotFound} />
              </Switch>
            </Layout>
          </Router>
        ) : null}
        {this.props.contentful.authState == 'loading' ? <Loading /> : null}
      </div>
    )
  }
}

export default connectComponent(App)
