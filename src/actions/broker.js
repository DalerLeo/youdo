import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/brokerSerializer'

export const brokerListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.BROKER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.BROKER_LIST,
        payload
    }
}

export const brokerCreateAction = (formValues) => {
    const data = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.BROKER_LIST, data)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.BROKER_CREATE,
        payload
    }
}

export const brokerItemFetchAction = (brokerId) => {
    const url = sprintf(API.BROKER_ITEM, brokerId)
    const payload = axios()
        .get(url)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.BROKER_ITEM,
        payload
    }
}

export const brokerItemEditAction = (brokerId, formValues) => {
    const url = sprintf(API.BROKER_EDIT, brokerId)
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
        type: actionTypes.BROKER_EDIT,
        payload
    }
}

export const brokerItemDeleteAction = (brokerId) => {
    const url = sprintf(API.BROKER_DELETE, brokerId)
    const payload = axios()
        .delete(url)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.BROKER_DELETE,
        payload
    }
}
