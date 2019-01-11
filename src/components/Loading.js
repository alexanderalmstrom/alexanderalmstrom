import React from 'react'
import PropTypes from 'prop-types'

import './Loading.scss'

class Loading extends React.Component {
  render() {
    return <div className="loading-screen">{this.props.message}</div>
  }
}

Loading.defaultProps = {
  message: 'Loading'
}

Loading.propTypes = {
  message: PropTypes.string
}

export default Loading
