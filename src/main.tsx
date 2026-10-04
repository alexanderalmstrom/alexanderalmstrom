import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { store } from './store'
import App from './components/App'

import './styles/index.css'

createRoot(document.getElementById('app')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function () {
    console.log('Service Worker Registered')
  })
}
