import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/statDebtorsSerializer'

export const statDebtorsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STATDEBTORS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_LIST,
        payload
    }
}

export const statDebtorsOrderListFetchAction = (id) => {
    const params = serializers.orderListFilterSerializer(id)
    const payload = axios()
        .get(API.STATDEBTORS_ORDER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_ORDER_LIST,
        payload

    }
}
export const statDebtorsSumFetchAction = () => {
    const payload = axios()
        .get(API.STATDEBTORS_SUM)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_SUM,
        payload
    }
}
