import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/systemPagesSerializer'

export const systemPagesCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.SYSTEM_PAGES_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SYSTEM_PAGES_CREATE,
        payload
    }
}

export const systemPagesDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.SYSTEM_PAGES_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SYSTEM_PAGES_DELETE,
        payload
    }
}

export const systemPagesUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.SYSTEM_PAGES_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SYSTEM_PAGES_UPDATE,
        payload
    }
}

export const systemPagesListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.SYSTEM_PAGES_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SYSTEM_PAGES_LIST,
        payload
    }
}

export const systemPagesItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.SYSTEM_PAGES_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SYSTEM_PAGES_ITEM,
        payload
    }
}