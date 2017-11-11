import axios from 'axios'
import {API_URL} from '../constants/api'
import * as storageHelper from '../helpers/storage'

const getDocument = (url, params) => {
    const TOKEN = storageHelper.getToken()
    axios.defaults.baseURL = API_URL
    if (!TOKEN) {
        return
    }
    let str = ''
    for (let key in params) {
        if (params[key]) {
            str += '&' + key + '=' + encodeURIComponent(params[key])
        }
    }
    window.location = API_URL + url + '?token=' + TOKEN + str
}

export default getDocument
