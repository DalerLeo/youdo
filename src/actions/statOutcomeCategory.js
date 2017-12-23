import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
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

export const statOutcomeCategoryItemFetchAction = (filter, filterItem, id) => {
    const params = serializers.itemSerializer(filter.getParams(), filterItem.getParams(), id)
    const payload = axios()
        .get(sprintf(API.STAT_OUTCOME_CATEGORY_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_OUTCOME_CATEGORY_ITEM,
        payload
    }
}

export const getTransactionData = (filter) => {
    const params = serializers.transactionSerializer(filter.getParams())
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
