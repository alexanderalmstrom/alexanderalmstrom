import { combineReducers } from 'redux'

import { contentful } from './contentful'
import { project } from './project'
import { projects } from './projects'

const rootReducer = combineReducers({
  contentful,
  project,
  projects
})

export default rootReducer
