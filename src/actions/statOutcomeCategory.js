import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statOutcomeCategorySerializer'

export const statOutcomeCategoryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_OUTCOME_CATEGORY_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_OUTCOME_CATEGORY_LIST,
        payload
    }
}

export const statOutcomeCategoryDetailFetchAction = (id, filter) => {
    const params = serializers.detailFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_OUTCOME_CATEGORY_DETAIL, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_OUTCOME_CATEGORY_DETAIL,
        payload
    }
}

export const getTransactionData = (filter, filterTransaction, id) => {
    const params = serializers.transactionSerializer(filter.getParams(), filterTransaction.getParams(), id)
    const payload = axios()
        .get(API.STAT_FINANCE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_OUTCOME_CATEGORY_TRANSACTION_DATA,
        payload
    }
}
