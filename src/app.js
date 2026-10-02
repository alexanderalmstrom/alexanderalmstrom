import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import promiseMiddleware from 'redux-promise-middleware'

import reducer from './reducers/index'
import App from './components/App'

function createAppStore() {
  // redux-promise-middleware 6 exports the middleware itself rather than a
  // factory, so it is passed through uncalled.
  // Contentful entries hold resolved links, which makes them non-plain and
  // circular, so Redux Toolkit's development-only state checks are turned off.
  return configureStore({
    reducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      }).concat(promiseMiddleware)
  })
}

const store = createAppStore()

createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <App />
  </Provider>
)

if (module.hot) {
  module.hot.accept('./reducers/index', () => {
    store.replaceReducer(require('./reducers/index').default)
  })
}
