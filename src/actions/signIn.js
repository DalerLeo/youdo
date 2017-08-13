import _ from 'lodash'
import axios from '../helpers/axios'
import * as storageHelper from '../helpers/storage'
import * as API from '../constants/api'
import {TOKEN_KEY, USER_GROUPS, IS_SUPERUSER} from '../constants/storage'
import * as actionTypes from '../constants/actionTypes'

export const setTokenAction = () => {
    return {
        type: `${actionTypes.SIGN_IN}_FULFILLED`,
        payload: storageHelper.getToken()
    }
}

export const signInAction = (params) => {
    const payload = axios()
        .post(API.SIGN_IN, params)
        .then((response) => {
            const rememberMe = _.get(params, 'rememberMe')
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

export const authConfirmAction = () => {
    const payload = axios().get(API.AUTH_CONFIRM)
        .then((response) => {
            const userData = _.get(response, 'data')
            storageHelper.setUser(userData)
        })
    return {
        type: actionTypes.AUTH_CONFIRM,
        payload
    }
}
