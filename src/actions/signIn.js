import _ from 'lodash'
import axios from '../helpers/axios'
import * as storageHelper from '../helpers/storage'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'

export const setTokenAction = () => {
  return {
    type: `${actionTypes.SIGN_IN}_FULFILLED`,
    payload: storageHelper.getToken()
  }
}

export const setAuthConfirmAction = () => {
  const userData = storageHelper.getUserData()
  if (userData) {
    return {
      type: `${actionTypes.AUTH_CONFIRM}_FULFILLED`,
      payload: JSON.parse(userData)
    }
  }
  return {
    type: `${actionTypes.AUTH_CONFIRM}_FULFILLED`,
    payload: {}
  }
}

export const authConfirmAction = (rememberUser) => {
  const payload = axios().get(API.AUTH_CONFIRM)
    .then((response) => {
      const userData = _.get(response, 'data')
      storageHelper.setUser(userData, rememberUser)
      return userData
    })
  return {
    type: actionTypes.AUTH_CONFIRM,
    payload
  }
}

export const signInAction = (params) => {
  const payload = axios(false)
    .post(API.SIGN_IN, params)
    .then((response) => {
      const rememberMe = _.get(params, 'rememberMe') || false
      const token = _.get(response, ['data', 'token'])

      // Save token in browser storage
      storageHelper.setToken(token, rememberMe)

      return token
    })
    .catch((error) => {
      const errorData = _.get(error, ['response', 'data'])

      return Promise.reject(
        errorData || {'nonFieldErrors': ['Internet connection error']}
      )
    })

  return {
    type: actionTypes.SIGN_IN,
    payload
  }
}

export const signOutAction = () => {
  const payload = axios().delete(API.SIGN_OUT)
    .then(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    .catch((error) => {
      const errorData = _.get(error, ['response', 'data'])
      return Promise.reject(errorData)
    })

  return {
    type: `${actionTypes.SIGN_IN}_CLEAR`,
    payload
  }
}

