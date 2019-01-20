import React from 'react'

import './NotFound.scss'

class NotFound extends React.Component {
  render() {
    return (
      <div className="container not-found">
        <div className="not-found-content">
          <h1>Uh-Oh! Huston, We have a problem</h1>
          <p>We could not find what you were looking for.</p>
        </div>
      </div>
    )
  }
}

export default NotFound
