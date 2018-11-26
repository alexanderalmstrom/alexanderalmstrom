import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import reducers from './reducers/index'

export default function configureStore (initialState) {
  const middleware = applyMiddleware(
    promiseMiddleware(),
    thunk,
    createLogger()
  )

  const enhancer = compose(middleware)
  
  const store = createStore(
    reducers,
    enhancer
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

import App from './components/App'

const render = Component => {
  ReactDOM.render(
    <Provider store={configureStore()}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App)
  })
}
