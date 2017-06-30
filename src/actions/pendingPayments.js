import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/pendingPaymentsSerializer'

export const pendingPaymentsUpdateAction = (formValues, order) => {
    const requestData = serializers.createSerializer(formValues, order)
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
