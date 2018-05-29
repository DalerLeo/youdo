import axios from 'axios'
import sprintf from 'sprintf'
import _ from 'lodash'
import {API_URL} from '../constants/api'
import * as storageHelper from '../helpers/storage'

const getDocument = (url, params) => {
  const TOKEN = storageHelper.getToken()
  const LANG = storageHelper.getLanguage()
  const GIVEN_URL = storageHelper.getApi()
  const FORMED_URL = (!_.isNil(GIVEN_URL) && GIVEN_URL !== 'undefined') ? `${GIVEN_URL}/%s/api/v1` : API_URL
  axios.defaults.baseURL = sprintf(FORMED_URL, LANG)
  if (!TOKEN) {
    return
  }
  let str = ''
  for (let key in params) {
    if (params[key]) {
      str += '&' + key + '=' + encodeURIComponent(params[key])
    }
  }
  window.location = sprintf(FORMED_URL, LANG) + url + '?token=' + TOKEN + str
}

export default getDocument
