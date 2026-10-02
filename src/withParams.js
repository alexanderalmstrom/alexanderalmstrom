import { useParams } from 'react-router-dom'

// React Router 7 removed the `match` prop passed to route components, so class
// components receive the route params through this wrapper instead.
export function withParams(Component) {
  function ComponentWithParams(props) {
    return <Component {...props} params={useParams()} />
  }

  ComponentWithParams.displayName = `withParams(${
    Component.displayName || Component.name || 'Component'
  })`

  return ComponentWithParams
}
