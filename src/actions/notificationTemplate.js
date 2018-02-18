import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/notificationSerializer'

export const notificationTemplateUpdateAction = (id, formValues, detail) => {
    const requestData = serializers.createSerializer(formValues, detail)
    const payload = axios()
        .put(sprintf(API.NOTIFICATION_TEMPLATE_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_TEMPLATE_UPDATE,
        payload
    }
}

export const notificationTemplateListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.NOTIFICATION_TEMPLATE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_TEMPLATE_LIST,
        payload
    }
}

export const notificationTemplateItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.NOTIFICATION_TEMPLATE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_TEMPLATE_ITEM,
        payload
    }
}
export const notificationTemplateChangeStatusAction = (id, detail) => {
    const requestData = serializers.changeSerializer(detail)
    const payload = axios()
        .put(sprintf(API.NOTIFICATION_TEMPLATE_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_TEMPLATE_ITEM,
        payload
    }
}
export const notificationAddUserAction = (id, formValues) => {
    const requestData = serializers.userSerializer(formValues)
    const payload = axios()
        .post(sprintf(API.NOTIFICATION_TEMPLATE_ADD_USER, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_TEMPLATE_ADD_USER,
        payload
    }
}
export const notificationRemoveUserAction = (id, user) => {
    const payload = axios()
        .post(sprintf(API.NOTIFICATION_TEMPLATE_REMOVE_USER, id), {user: user})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.NOTIFICATION_TEMPLATE_REMOVE_USER,
        payload
    }
}
