import axios from './axios'
import toCamelCase from './toCamelCase'
import caughtCancel from './caughtCancel'

const getIdsOption = (ids, path) => {
  return axios().get(`${path}?ids=${ids || ''}`)
    .then(({data}) => {
      return Promise.resolve(toCamelCase(data.results))
    })
    .catch((error) => {
      caughtCancel(error)
    })
}

export default getIdsOption
