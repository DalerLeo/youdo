import {TOKEN_KEY, USER_GROUPS, IS_SUPERUSER, PAGE_SIZE, LANGUAGE, API_HOST} from '../constants/storage'

export const getStorage = (local) => {
  return local ? localStorage : sessionStorage
}

export const setToken = (token, local = false) => {
  const storage = getStorage(local)

  storage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export const setUser = (userData, local = false) => {
  const storage = getStorage(local)

  storage.setItem(USER_GROUPS, JSON.stringify(userData))
}

export const setPageSize = (value, local = false) => {
  const storage = getStorage(local)
  storage.setItem(PAGE_SIZE, value)
}

export const getUserData = () => {
  return localStorage.getItem(USER_GROUPS) || sessionStorage.getItem(USER_GROUPS)
}
export const getValue = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

export const getPageSize = () => {
  return localStorage.getItem(PAGE_SIZE) || sessionStorage.getItem(PAGE_SIZE)
}

export const setLanguage = (language, local = false) => {
  const storage = getStorage(local)
  storage.setItem(LANGUAGE, language)
}

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE) || 'ru'
}
export const setApi = (api, local = true) => {
  const storage = getStorage(local)
  storage.setItem(API_HOST, api)
}

export const getApi = () => {
  return localStorage.getItem(API_HOST)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_GROUPS)
  sessionStorage.removeItem(USER_GROUPS)
  localStorage.removeItem(IS_SUPERUSER)
  sessionStorage.removeItem(IS_SUPERUSER)
}
