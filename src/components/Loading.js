import React from 'react'
import PropTypes from 'prop-types'

import './Loading.scss'

class Loading extends React.Component {
  render() {
    return (
      <div className="loading">
        <div className="loading-inner">
          <i className="loading-icon" />
          <p className="loading-message">{this.props.message}</p>
        </div>
      </div>
    )
  }
}

Loading.defaultProps = {
  message: 'Loading'
}

Loading.propTypes = {
  message: PropTypes.string
}

export default Loading
