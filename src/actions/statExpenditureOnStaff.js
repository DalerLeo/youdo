import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statExpenditureOnStaffSerializer'

export const listFetchAction = (filter) => {
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

export const detailFetchAction = (id, filter) => {
    const params = serializers.detailFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_EXPENDITURE_ON_STAFF_DETAIL, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_EXPENDITURE_ON_STAFF_DETAIL,
        payload
    }
}

export const getTransactionData = (filter, filterTransaction, staff) => {
    const params = serializers.transactionSerializer(filter.getParams(), filterTransaction.getParams(), staff)
    const payload = axios()
        .get(API.TRANSACTION_CATEGORY_DATA_LIST, {params})
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
