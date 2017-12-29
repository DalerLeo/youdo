import axios from 'axios'
import sprintf from 'sprintf'
import {API_URL} from '../constants/api'
import * as storageHelper from '../helpers/storage'

const getDocument = (url, params) => {
    const TOKEN = storageHelper.getToken()
    const LANG = storageHelper.getLanguage()
    axios.defaults.baseURL = sprintf(API_URL, LANG)
    if (!TOKEN) {
        return
    }
    let str = ''
    for (let key in params) {
        if (params[key]) {
            str += '&' + key + '=' + encodeURIComponent(params[key])
        }
    }
    window.location = sprintf(API_URL, LANG) + url + '?token=' + TOKEN + str
}

export default getDocument
