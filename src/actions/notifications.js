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

export const notificationListFetchAction = () => {
    const payload = axios()
        .get(API.NOTIFICATIONS_LIST)
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

export const notificationItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.NOTIFICATIONS_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATIONS_ITEM,
        payload
    }
}

export const notificationGetNotViewed = () => {
    const payload = axios()
        .get(API.NOTIFICATIONS_GET_NOT_VIEWED)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATIONS_TIME_INTERVAL,
        payload
    }
}
