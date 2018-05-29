import _ from 'lodash'
import axios from 'axios'
import {API_URL} from '../constants/api'
import * as storageHelper from '../helpers/storage'
import {hashHistory} from 'react-router'
import * as ROUTES from '../constants/routes'
// Import sprintf from 'sprintf'

const axiosRequest = (useToken = true) => {
  const TOKEN = storageHelper.getToken()
    // Const LANG = storageHelper.getLanguage()
  const GIVEN_URL = storageHelper.getApi()
    // Const FORMED_URL = (!_.isNil(GIVEN_URL) && GIVEN_URL !== 'undefined') ? `${GIVEN_URL}/%s/api/v1` : API_URL
  const FORMED_URL = (!_.isNil(GIVEN_URL) && GIVEN_URL !== 'undefined') ? `${GIVEN_URL}/api/v1` : API_URL
  const UNAUTHORIZATE_STATUS = 401
  const NORM_STATUS_BEGIN = 200
  const NORM_STATUS_END = 300
    // Axios.defaults.baseURL = sprintf(FORMED_URL, LANG)
  axios.defaults.baseURL = FORMED_URL

  if (TOKEN) {
    if (useToken) {
      axios.defaults.headers.common.Authorization = `Token ${TOKEN}`
    } else {
      axios.defaults.headers.common.Authorization = ''
    }
    axios.defaults.headers.common['cache-control'] = 'no-cache'
    axios.defaults.validateStatus = (status) => {
      if (status === UNAUTHORIZATE_STATUS) {
        axios.defaults.headers.common.Authorization = ''
        storageHelper.removeToken()
        hashHistory.push(ROUTES.SIGN_IN)
      }
      return status >= NORM_STATUS_BEGIN && status < NORM_STATUS_END
    }
  } else {
    axios.defaults.headers.common.Authorization = ''
  }

  return axios
}

export default axiosRequest
