import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/stockReceiveSerializer'

export const stockReceiveCreateAction = (formValues, supplyId, productId) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(sprintf(API.STOCK_RECEIVE_CREATE, supplyId, productId), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_CREATE,
        payload
    }
}

export const stockReceiveListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STOCK_RECEIVE_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_LIST,
        payload
    }
}

export const stockReceiveItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STOCK_RECEIVE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_ITEM,
        payload
    }
}

export const stockHistoryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STOCK_HISTORY_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_HISTORY_LIST,
        payload
    }
}

export const stockTransferListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STOCK_TRANSFER_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_TRANSFER_LIST,
        payload
    }
}

