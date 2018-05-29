import {get, curry} from 'lodash/fp'

export const getStoreListData = curry((name, state) => get([name, 'list', 'data'], state))
export const getStoreItemData = curry((name, state) => get([name, 'item', 'data'], state))

export const getDataFromState = curry((name, state) => ({
  loading: get([name, 'loading'], state),
  data: get([name, 'data'], state)
}))

export const compareFilterByProps = (props, nextProps, except = {}) => {
  return props.filter.filterRequest(except) === nextProps.filter.filterRequest(except)
}
