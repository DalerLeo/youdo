import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/pendingPaymentsSerializer'

export const pendingPaymentsCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.PENDING_PAYMENTS_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_PAYMENTS_CREATE,
        payload
    }
}

export const pendingPaymentsDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.PENDING_PAYMENTS_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_PAYMENTS_DELETE,
        payload
    }
}

export const pendingPaymentsUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.PENDING_PAYMENTS_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_PAYMENTS_UPDATE,
        payload
    }
}

export const pendingPaymentsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PENDING_PAYMENTS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_PAYMENTS_LIST,
        payload
    }
}

export const pendingPaymentsCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PENDING_PAYMENTS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_PAYMENTS_LIST_CSV,
        payload
    }
}

export const pendingPaymentsItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PENDING_PAYMENTS_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_PAYMENTS_ITEM,
        payload
    }
}
