/*
Import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
*/
const getStorage = (local) => {
    return local ? localStorage : sessionStorage
}

/*
Const setConfigs = (configs) => {
    const storage = getStorage(false)

    _.forIn(configs, (value, key) => {
        storage.setItem(key, value)
    })
}
*/
const getConfig = (text) => {
    const value = getStorage(false).getItem(text)

/*    If (_.isEmpty(value) && !sessionStorage.length) {
        axios()
            .get(API.CONFIG)
            .then((response) => {
                setConfigs(_.get(response, 'data'))
            })
            .catch((error) => {
                return Promise.reject(_.get(error, ['response', 'data']))
            })
    } */
    return value
}

export default getConfig
