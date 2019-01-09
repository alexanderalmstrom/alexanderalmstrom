import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { connectComponent } from '../connect'
import * as contentfulService from '../services/contentful'

import Loading from './Loading'
import Notice from './Notice'

import Projects from './Projects'
import Project from './Project'
import NotFound from './NotFound'

import Layout from './Layout'

import './App.scss'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    contentfulService
      .initClient()
      .then(
        () => this.props.setAppContentfulState('success'),
        () => this.props.setAppContentfulState('error')
      )
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
              <title>{this.props.contentful.space.name}</title>
              <meta name="description" content="" />
            </Helmet>
            <Layout>
              <Switch>
                <Route exact path="/" component={Projects} />
                <Route path="/project/:slug" component={Project} />
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
