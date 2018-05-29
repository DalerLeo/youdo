import {get, curry} from 'lodash/fp'

export const getDataFromState = curry((name, state) => ({
  loading: get([name, 'loading'], state),
  data: get([name, 'data'], state)
}))

export const compareFilterByProps = (props, nextProps) => {
  return props.filter.filterRequest() === nextProps.filter.filterRequest()
}
