import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/transactionSerializer'

export const transactionCreateAction = (formValues, cashboxId) => {
    const requestData = serializers.createSerializer(formValues, cashboxId)
    const payload = axios()
        .post(API.TRANSACTION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_CREATE,
        payload
    }
}

export const transactionIncomeAction = (formValues, cashboxId) => {
    const requestData = serializers.createIncomeSerializer(formValues, cashboxId)
    const payload = axios()
        .post(API.TRANSACTION_INCOME, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_INCOME,
        payload
    }
}

export const transactionSendAction = (formValues, cashboxId) => {
    const requestData = serializers.createSendSerializer(formValues, cashboxId)
    const payload = axios()
        .post(API.TRANSACTION_SEND, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_SEND,
        payload
    }
}

export const transactionDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.TRANSACTION_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_DELETE,
        payload
    }
}

export const transactionUpdateAction = (id, formValues, cashboxId) => {
    const requestData = serializers.createSerializer(formValues, cashboxId)
    const payload = axios()
        .put(sprintf(API.TRANSACTION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_UPDATE,
        payload
    }
}

export const transactionUpdateIncomeAction = (id, formValues, cashboxId) => {
    const requestData = serializers.createSerializer(formValues, cashboxId)
    const payload = axios()
        .put(sprintf(API.TRANSACTION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_UPDATE_INCOME,
        payload
    }
}

export const transactionListFetchAction = (filter, cashboxId) => {
    const params = serializers.listFilterSerializer(filter.getParams(), cashboxId)
    const payload = axios()
        .get(API.TRANSACTION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_LIST,
        payload
    }
}

export const transactionCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.TRANSACTION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_LIST_CSV,
        payload
    }
}

export const transactionItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.TRANSACTION_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_ITEM,
        payload
    }
}
