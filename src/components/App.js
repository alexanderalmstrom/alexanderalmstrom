import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import posed, { PoseGroup } from 'react-pose'

import { connectComponent } from '../connect'
import * as contentfulService from '../services/contentful'

import Layout from './Layout'
import Loading from './Loading'
import Notice from './Notice'
import NotFound from './NotFound'
import Home from './Home'
import Project from './Project'
import Page from './Page'

import './App.scss'

const RouteContainer = posed.div({
  enter: {
    opacity: 1,
    delay: 300,
    beforeChildren: true
  },
  exit: {
    opacity: 0
  }
})

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
      <Router className="app">
        {this.props.contentful.authState == 'error' ? (
          <Notice message="Error when establishing connection with Contentful" />
        ) : null}
        {this.props.contentful.authState == 'success' ? (
          <div>
            <Route
              render={({ location }) => (
              <div>
                <Helmet>
                  <title>{this.props.contentful.space.name}</title>
                  <meta name="description" content="" />
                </Helmet>
                <Layout>
                  <PoseGroup>
                    <RouteContainer key={location.key} className="route-container">
                      <Switch location={location}>
                        <Route exact path="/" component={Home} key="" />
                        <Route path="/project/:slug" component={Project} key="project" />
                        <Route path="/page/:slug" component={Page} key="page" />
                        <Route path="*" component={NotFound} key="notfound" />
                      </Switch>
                    </RouteContainer>
                  </PoseGroup>
                </Layout>
              </div>
            )} />
          </div>
        ) : null}
        {this.props.contentful.authState == 'loading' ? <Loading /> : null}
      </Router>
    )
  }
}

export default connectComponent(App)
