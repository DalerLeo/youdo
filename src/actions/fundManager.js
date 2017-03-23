import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/fundManagerSerializer'

export const fundManagerListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.FUND_MANAGER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.FUND_MANAGER_LIST,
        payload
    }
}

export const fundManagerCreateAction = (formValues) => {
    const data = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.FUND_MANAGER_LIST, data)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.FUND_MANAGER_CREATE,
        payload
    }
}

export const fundManagerItemFetchAction = (fundManagerId) => {
    const url = sprintf(API.FUND_MANAGER_ITEM, fundManagerId)
    const payload = axios()
        .get(url)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.FUND_MANAGER_ITEM,
        payload
    }
}

export const fundManagerItemEditAction = (fundManagerId, formValues) => {
    const url = sprintf(API.FUND_MANAGER_EDIT, fundManagerId)
    const data = serializers.createSerializer(formValues)
    const payload = axios()
        .put(url, data)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.FUND_MANAGER_EDIT,
        payload
    }
}

export const fundManagerItemDeleteAction = (fundManagerId) => {
    const url = sprintf(API.FUND_MANAGER_DELETE, fundManagerId)
    const payload = axios()
        .delete(url)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.FUND_MANAGER_DELETE,
        payload
    }
}
