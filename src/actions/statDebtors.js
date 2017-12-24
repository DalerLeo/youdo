import _ from 'lodash'
import sprintf from 'sprintf'
import moment from 'moment'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statDebtorsSerializer'

export const statDebtorsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_DEBTORS_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_LIST,
        payload
    }
}

export const statDebtorsDataFetchAction = () => {
    const payload = axios()
        .get(API.STAT_DEBTORS_DATA)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_DATA,
        payload
    }
}

export const statDebtorsItemFetchAction = (id, filter) => {
    const params = serializers.itemSerializer(id, filter.getParams())
    const payload = axios()
        .get(API.STAT_DEBTORS_ITEM, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_ITEM,
        payload
    }
}

export const statDebtorsOrderItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.ORDER_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_ITEM,
        payload
    }
}

export const orderMultiUpdateAction = (data, orders) => {
    const requestData = {
        order_list: orders,
        payment_date: moment(_.get(data, 'paymentDate')).format('YYYY-MM-DD')
    }
    const payload = axios()
        .post(API.ORDER_MULTI_UPDATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_MULTI_UPDATE,
        payload
    }
}
