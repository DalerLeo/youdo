import {TOKEN_KEY, USER_GROUPS, IS_SUPERUSER} from '../constants/storage'
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
    const isSuper = _.get(userData, 'is_superuser')

    storage.setItem(USER_GROUPS, groups)
    storage.setItem(IS_SUPERUSER, isSuper)
}

export const getGroups = () => {
    return _.split(localStorage.getItem(USER_GROUPS) || sessionStorage.getItem(USER_GROUPS), ',')
}

export const getValue = (key) => {
    return localStorage.getItem(key) || sessionStorage.getItem(key)
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_GROUPS)
    sessionStorage.removeItem(USER_GROUPS)
    localStorage.removeItem(IS_SUPERUSER)
    sessionStorage.removeItem(IS_SUPERUSER)
}
