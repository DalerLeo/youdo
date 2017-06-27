import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'

const getStorage = (local) => {
    return local ? localStorage : sessionStorage
}

const setConfigs = (configs) => {
    const storage = getStorage(false)

    _.forIn(configs, (value, key) => {
        storage.setItem(key, value)
    })
}

const getConfig = (text) => {
    if (getStorage(false).getItem(text)) {
        return getStorage(false).getItem(text)
    }
    axios()
        .get(API.CONFIG)
        .then((response) => {
            setConfigs(_.get(response, 'data'))
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return getStorage(false).getItem(text)
}

export default getConfig
