import { configureStore } from '@reduxjs/toolkit'
import promiseMiddleware from 'redux-promise-middleware'

import reducer from './reducers/index'

// redux-promise-middleware 6 exports the middleware itself rather than a
// factory, so it is passed through uncalled.
// Contentful entries hold resolved links, which makes them non-plain and
// circular, so Redux Toolkit's development-only state checks are turned off.
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(promiseMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
