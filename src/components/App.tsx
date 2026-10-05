import { useEffect } from 'react'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom'

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

// ScrollRestoration scrolls to the top on a new navigation and back to where
// the visitor was on back and forward. It needs a data router to work.
function Root() {
  return (
    <Layout>
      <Outlet />
      <ScrollRestoration />
    </Layout>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/project/:slug', element: <Project /> },
      { path: '/page/:slug', element: <Page /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

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
      {status == 'success' ? <RouterProvider router={router} /> : null}
      {status == 'pending' ? <Loading /> : null}
    </div>
  )
}
