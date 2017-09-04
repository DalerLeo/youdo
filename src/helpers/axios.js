import axios from 'axios'
import {API_URL} from '../constants/api'
import * as storageHelper from '../helpers/storage'
import {hashHistory} from 'react-router'
import * as ROUTES from '../constants/routes'

const axiosRequest = (useToken = true) => {
    const TOKEN = storageHelper.getToken()
    const UNAUTHORIZATE_STATUS = 401
    const NORM_STATUS_BEGIN = 200
    const NORM_STATUS_END = 300
    axios.defaults.baseURL = API_URL

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
