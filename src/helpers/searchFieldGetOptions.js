import axios from '../helpers/axios'
import toCamelCase from '../helpers/toCamelCase'
import _ from 'lodash'
import caughtCancel from '../helpers/caughtCancel'

const CancelToken = axios().CancelToken
let listToken = null
const PAGE_SIZE = 100
const getOptions = (api, search, params, pageSize = PAGE_SIZE) => {
  if (listToken) {
    listToken.cancel()
  }
  listToken = CancelToken.source()
  return axios().get(api, {params: _.merge(_.merge(params, {search}), {page_size: pageSize}), cancelToken: listToken.token})
    .then(({data}) => {
      if (data.results) {
        return Promise.resolve(toCamelCase(data.results))
      }
      return Promise.resolve(toCamelCase(data))
    })
    .catch((error) => {
      caughtCancel(error)
    })
}

export default getOptions
