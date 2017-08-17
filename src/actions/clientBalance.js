import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/clientBalanceSerializer'

export const clientBalanceListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.CLIENT_BALANCE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_BALANCE_LIST,
        payload
    }
}

export const clientBalanceItemFetchAction = (filter, id, division, type) => {
    const params = serializers.itemFilterSerializer(filter.getParams(), id, division, type)
    const payload = axios()
        .get(API.CLIENT_BALANCE_ITEM, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_BALANCE_ITEM,
        payload
    }
}

export const clientBalanceCreateExpenseAction = (formValues, clientId) => {
    const requestData = serializers.createExpenseSerializer(formValues, clientId)
    const payload = axios()
        .post(API.CLIENT_TRANSACTION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_EXPENSE,
        payload
    }
}

export const clientBalanceReturnAction = (formValues, id) => {
    const requestData = serializers.createReturnSerializer(formValues, id)
    const payload = axios()
        .post(API.CLIENT_TRANSACTION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_EXPENSE,
        payload
    }
}
