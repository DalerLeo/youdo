import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'

export const notificationDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.NOTIFICATIONS_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATIONS_DELETE,
        payload
    }
}

export const notificationListFetchAction = (page) => {
    const payload = axios()
        .get(API.NOTIFICATIONS_LIST, {params: {page: page, page_size: 15}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATIONS_LIST,
        payload
    }
}

export const notificationCountFetchAction = () => {
    const payload = axios()
        .get(API.NOTIFICATIONS_GET_COUNT)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.NOTIFICATIONS_GET_COUNT,
        payload
    }
}
