import fp, {get, curry, curryRight} from 'lodash/fp'
import isUndefined from 'lodash/isUndefined'

export const getStoreListData = curry((name, state) => get([name, 'list', 'data'], state))
export const getStoreItemData = curry((name, state) => get([name, 'item', 'data'], state))

export const getDataFromState = curry((name, state) => ({
  loading: get([name, 'loading'], state),
  data: get([name, 'data'], state)
}))

export const compareFilterByProps = curryRight((props, nextProps, except) => {
  return props.filter.filterRequest(except) === nextProps.filter.filterRequest(except)
})

export const getOnlyString = (str) => {
  if ((str === null) || (str === '') || isUndefined(str)) return null

  return fp.trim(
    str
      .replace(/<[^>]*>/g, '')
      .replace(/&[^;]*;/g, '')
      .replace(/\/[^\/]*\//g, '')
      .replace(/{[^}]*}/g, '')
  )
}
