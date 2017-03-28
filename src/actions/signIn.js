import _ from 'lodash'
import axios from '../helpers/axios'
import * as storageHelper from '../helpers/storage'
import * as API from '../constants/api'
import {TOKEN_KEY} from '../constants/storage'
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
            const data = _.get(error, ['response', 'data'])

            return Promise.reject(data || {'Network': ['Internet connection error']})
        })

    return {
        type: actionTypes.SIGN_IN,
        payload
    }
}

export const signOutAction = () => {
    const payload = axios().delete(API.SIGN_OUT)
        .then(() => {
            localStorage.removeItem(TOKEN_KEY)
            sessionStorage.removeItem(TOKEN_KEY)
        })
        .catch((error) => {
            const data = _.get(error, ['response', 'data'])
            return Promise.reject(data)
        })

    return {
        type: `${actionTypes.SIGN_IN}_CLEAR`,
        payload
    }
}
