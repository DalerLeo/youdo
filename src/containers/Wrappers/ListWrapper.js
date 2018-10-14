import {pure, compose, mapPropsStream} from 'recompose'
import {connect} from 'react-redux'
import _ from 'lodash'
import {compareFilterByProps} from '../../helpers/get'
import filterHelper from '../../helpers/filter'

export default params => {
  const {
    listFetchAction,
    except = {},
    storeName
  } = params

  const mapStateToProps = (state, props) => {
    const list = _.get(state, [storeName, 'list', 'data']) || {results: []}
    const listLoading = _.get(state, [storeName, 'list', 'loading'])
    const query = _.get(props, ['location', 'query'])
    const pathname = _.get(props, ['location', 'pathname'])
    const filter = filterHelper(list, pathname, query)

    if (!listFetchAction) {
      return {
        [`${storeName}List`]: {
          list,
          loading: listLoading,
          filter
        }
      }
    }

    return {
      list,
      listLoading,
      filter
    }
  }
  if (!listFetchAction) {
    return compose(
      connect(mapStateToProps),
      pure
    )
  }

  return compose(
    connect(mapStateToProps, {listFetchAction}),
    mapPropsStream(props$ => {
      props$
        .distinctUntilChanged(compareFilterByProps(except))
        .subscribe(({filter, ...props}) => props.listFetchAction(filter))
      return props$
    }),
    pure
  )
}
