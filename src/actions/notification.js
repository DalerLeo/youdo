import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/notificationSerializer'

export const notificationCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.NOTIFICATION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_CREATE,
        payload
    }
}

export const notificationDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.NOTIFICATION_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.NOTIFICATION_DELETE,
        payload
    }
}

export const notificationUpdateAction = (id, formValues, detail) => {
    const requestData = serializers.createSerializer(formValues, detail)
    const payload = axios()
        .put(sprintf(API.NOTIFICATION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_UPDATE,
        payload
    }
}

export const notificationListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.NOTIFICATION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_LIST,
        payload
    }
}

export const notificationItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.NOTIFICATION_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_ITEM,
        payload
    }
}
export const notificationChangeStatusAction = (id, detail) => {
    const requestData = serializers.changeSerializer(detail)
    const payload = axios()
        .put(sprintf(API.NOTIFICATION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_ITEM,
        payload
    }
}
