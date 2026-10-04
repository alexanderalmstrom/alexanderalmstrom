import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { setAppContentfulState } from '../actions'
import { useAppDispatch, useAppSelector } from '../hooks/store'
import * as contentfulService from '../services/contentful'
import { createEvent } from '../services/helpers'

import Layout from './Layout'
import Loading from './Loading'
import Notice from './Notice'
import NotFound from './NotFound'
import Home from './Home'
import Project from './Project'
import Page from './Page'

const appLoadedEvent = createEvent('APP_LOADED')

export default function App() {
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.contentful.authState)

  useEffect(() => {
    contentfulService.initClient().then(
      () => dispatch(setAppContentfulState('success')),
      () => dispatch(setAppContentfulState('error')),
    )
  }, [dispatch])

  useEffect(() => {
    if (authState == 'success') {
      document.dispatchEvent(appLoadedEvent)
    }
  }, [authState])

  return (
    <div>
      {authState == 'error' ? (
        <Notice message="Error when establishing connection with Contentful" />
      ) : null}
      {authState == 'success' ? (
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
      {authState == 'loading' ? <Loading /> : null}
    </div>
  )
}
