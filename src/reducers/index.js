import { combineReducers } from 'redux'

import { contentful } from './contentful'
import { projects } from './projects'
import { page } from './page'

const rootReducer = combineReducers({
  contentful,
  projects,
  page
})

export default rootReducer
