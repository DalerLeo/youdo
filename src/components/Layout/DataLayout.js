import React from 'react'
import _ from 'lodash'
import {spheresFetchAction} from 'containers/Performer/actions/applicant'
export default Component => {
  return class DataLayout extends React.Component {
    componentDidUpdate (prevProps, prevState, snapshot) {
      const {spheres, dispatch} = this.props
      if (_.isEmpty(_.get(spheres, 'results'))) {
        dispatch(spheresFetchAction())
      }
    }

    render () {
      return <Component {...this.props}/>
    }
  }
}
