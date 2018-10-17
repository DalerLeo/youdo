import axios from 'axios'
import _ from 'lodash'
import {API_URL} from '../constants/api'
import * as storageHelper from '../helpers/storage'

const getDocument = (url, params) => {
  const TOKEN = storageHelper.getToken()
  const GIVEN_URL = storageHelper.getApi()
  const FORMED_URL = (!_.isNil(GIVEN_URL) && GIVEN_URL !== 'undefined') ? GIVEN_URL : API_URL
  axios.defaults.baseURL = FORMED_URL
  if (!TOKEN) {
    return
  }
  let str = ''
  for (let key in params) {
    if (params[key]) {
      str += '&' + key + '=' + encodeURIComponent(params[key])
    }
  }
  window.location = FORMED_URL + url + '?token=' + TOKEN + str
}

export default getDocument
