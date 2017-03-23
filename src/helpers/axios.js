import axios from 'axios'
import {API_URL} from '../constants/api'
import * as storageHelper from '../helpers/storage'

const axiosRequest = () => {
    const TOKEN = storageHelper.getToken()

    axios.defaults.baseURL = API_URL
    axios.defaults.headers.common['Authorization'] = TOKEN ? `Token ${TOKEN}` : undefined

    return axios
}

export default axiosRequest
