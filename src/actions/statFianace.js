import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statFinanceSerializer'

export const statFinanceOutDataFetchAction = (filter) => {
    const params = serializers.expense(filter.getParams())
    const payload = axios()
        .get(API.STAT_FINANCE_DATA, {params, type: 'expense'})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_FINANCE_DATA_OUT,
        payload
    }
}

export const statFinanceInDataFetchAction = (filter) => {
    const params = serializers.income(filter.getParams())
    const payload = axios()
        .get(API.STAT_FINANCE_DATA, {params, type: 'income'})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_FINANCE_DATA_IN,
        payload
    }
}
export const statFinanceListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_FINANCE_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_FINANCE_LIST,
        payload
    }
}
