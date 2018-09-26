import {pure, compose, mapPropsStream} from 'recompose'
import {connect} from 'react-redux'
import _ from 'lodash'
import {flow, get, toInteger} from 'lodash/fp'
export default params => {
  const {
    itemFetchAction,
    storeName,
    paramName = 'id'
  } = params
  const mapStateToProps = (state) => {
    const detail = _.get(state, [storeName, 'item', 'data'])
    const detailLoading = _.get(state, [storeName, 'item', 'loading'])

    return {
      detail,
      detailLoading
    }
  }
  return compose(
    connect(mapStateToProps, {itemFetchAction}),

    mapPropsStream(props$ => {
      props$
        .filter(get(['params', paramName]))
        .distinctUntilChanged(null, get(['params', paramName]))
        .subscribe(props => {
          const id = flow(get(['params', paramName]), toInteger)(props)
          props.itemFetchAction(id)
        })
      return props$
    }),
    pure
  )
}
