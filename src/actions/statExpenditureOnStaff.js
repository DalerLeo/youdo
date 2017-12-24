import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statExpenditureOnStaffSerializer'

export const statExpenditureOnStaffListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_EXPENDITURE_ON_STAFF_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_EXPENDITURE_ON_STAFF_LIST,
        payload
    }
}

export const getTransactionData = (filter, filterTransaction) => {
    const params = serializers.transactionSerializer(filter.getParams(), filterTransaction.getParams())
    const payload = axios()
        .get(API.STAT_FINANCE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_EXPENDITURE_ON_STAFF_TRANSACTION_DATA,
        payload
    }
}
