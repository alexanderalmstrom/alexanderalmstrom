import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { useSpace } from '../hooks/queries'
import { createEvent, isApple } from '../services/helpers'

import Layout from './Layout'
import Loading from './Loading'
import BlueScreen from './BlueScreen'
import NotFound from './NotFound'
import Home from './Home'
import Project from './Project'
import Page from './Page'
import SadMac from './SadMac'

const appLoadedEvent = createEvent('APP_LOADED')

const ErrorScreen = isApple() ? SadMac : BlueScreen

export default function App() {
  const { status, refetch } = useSpace()

  useEffect(() => {
    if (status == 'success') {
      document.dispatchEvent(appLoadedEvent)
    }
  }, [status])

  return (
    <div>
      {status == 'error' ? <ErrorScreen onRestart={() => refetch()} /> : null}
      {status == 'success' ? (
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
      {status == 'pending' ? <Loading /> : null}
    </div>
  )
}
