import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/ClientTransaction/clientTransactionSerializer'

export const clientTransactionCreateIncomeAction = (formValues, clientId) => {
    const requestData = serializers.createIncomeSerializer(formValues, clientId)
    const payload = axios()
        .post(API.CLIENT_TRANSACTION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_INCOME,
        payload
    }
}

export const clientTransactionCreateExpenseAction = (formValues, clientId) => {
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

export const clientTransactionCreateSendAction = (formValues, clientId) => {
    const requestData = serializers.createSendSerializer(formValues, clientId)
    const payload = axios()
        .post(API.CLIENT_TRANSACTION_SEND, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_SEND,
        payload
    }
}

export const clientTransactionDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.CLIENT_TRANSACTION_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_DELETE,
        payload
    }
}

export const clientTransactionUpdateExpenseAction = (id, formValues, clientId) => {
    const requestData = serializers.createExpenseSerializer(formValues, clientId)
    const payload = axios()
        .put(sprintf(API.CLIENT_TRANSACTION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_UPDATE,
        payload
    }
}

export const clientTransactionListFetchAction = (filter, clientId) => {
    const params = serializers.listFilterSerializer(filter.getParams(), clientId)
    const payload = axios()
        .get(API.CLIENT_TRANSACTION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_LIST,
        payload
    }
}

export const clientTransactionCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.CLIENT_TRANSACTION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_LIST_CSV,
        payload
    }
}

export const clientTransactionItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.CLIENT_TRANSACTION_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_ITEM,
        payload
    }
}
