import _ from 'lodash'
import React from 'react'

export default Component => {
  return class DeepPure extends React.Component {
    shouldComponentUpdate (nextProps) {
      return !_.isEqual(nextProps, this.props)
    }

    render () {
      return <Component {...this.props}/>
    }
  }
}
