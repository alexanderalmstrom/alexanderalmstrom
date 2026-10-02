import React from 'react'

import './Notice.scss'

class Notice extends React.Component {
  render() {
    return <div className="notice">{this.props.message}</div>
  }
}

Notice.defaultProps = {
  message: 'Something went wrong.',
}

export default Notice
