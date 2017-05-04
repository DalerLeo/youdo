import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/cashboxSerializer'

export const cashboxCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.CASHBOX_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_CREATE,
        payload
    }
}

export const cashboxDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.CASHBOX_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_DELETE,
        payload
    }
}

export const cashboxUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.CASHBOX_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_UPDATE,
        payload
    }
}

export const cashboxListFetchAction = () => {
    const payload = axios()
        .get(API.CASHBOX_LIST)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_LIST,
        payload
    }
}

export const cashboxCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.CASHBOX_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_LIST_CSV,
        payload
    }
}

export const cashboxItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.CASHBOX_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_ITEM,
        payload
    }
}
