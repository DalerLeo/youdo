import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statSalesSerializer'

export const statSalesDataFetchAction = (filter, withOrderReturn) => {
    const params = serializers.listFilterSerializer(filter.getParams(), withOrderReturn)
    const payload = axios()
        .get(API.STAT_SALES_DATA, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_SALES_DATA,
        payload
    }
}

export const statSalesReturnDataFetchAction = (filter) => {
    const params = serializers.returnGraphSerializer(filter.getParams())
    const payload = axios()
        .get(API.STAT_RETURN_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_RETURN_LIST,
        payload
    }
}

export const orderListFetchAction = (filter, withOrderReturn) => {
    const params = serializers.orderListFilterSerializer(filter.getParams(), withOrderReturn)
    const payload = axios()
        .get(API.ORDER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_LIST,
        payload
    }
}

export const orderListPintFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.ORDER_LIST_PRINT, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_LIST_PRINT,
        payload
    }
}
