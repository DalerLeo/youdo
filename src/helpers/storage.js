import {TOKEN_KEY, USER_DATA} from '../constants/storage'

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

export const setUser = (token, local = false) => {
    const storage = getStorage(local)

    storage.setItem(USER_DATA, token)
}

export const getUser = () => {
    return localStorage.getItem(USER_DATA) || sessionStorage.getItem(USER_DATA)
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
}
