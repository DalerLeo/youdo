import {TOKEN_KEY, USER_GROUPS} from '../constants/storage'
import _ from 'lodash'

export const getStorage = (local) => {
    return local ? localStorage : sessionStorage
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export const setToken = (token, local = false) => {
    const storage = getStorage(local)

    storage.setItem(TOKEN_KEY, token)
}

export const setUser = (userData, local = false) => {
    const storage = getStorage(local)
    const groups = _.map(_.get(userData, 'groups'), (item) => {
        return _.get(item, 'id')
    })
    storage.setItem(USER_GROUPS, groups)
}

export const getGroups = () => {
    return _.split(localStorage.getItem(USER_GROUPS) || sessionStorage.getItem(USER_GROUPS), ',')
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
}
