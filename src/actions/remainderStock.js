import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/remainderStockSerializer'

export const remainderStockCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.REMAINDER_STOCK_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_STOCK_CREATE,
        payload
    }
}

export const remainderStockDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.REMAINDER_STOCK_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_STOCK_DELETE,
        payload
    }
}

export const remainderStockUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.REMAINDER_STOCK_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_STOCK_UPDATE,
        payload
    }
}

export const remainderStockListFetchAction = (filter, id) => {
    const params = serializers.listFilterSerializer(filter.getParams(), id)
    const payload = axios()
        .get((API.REMAINDER_STOCK_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_STOCK_LIST,
        payload
    }
}

export const remainderStockCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.REMAINDER_STOCK_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_STOCK_LIST_CSV,
        payload
    }
}

export const remainderStockItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.REMAINDER_STOCK_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_STOCK_ITEM,
        payload
    }
}
