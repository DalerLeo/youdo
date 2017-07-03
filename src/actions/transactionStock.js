import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Transaction/transactionStockSerializer'

export const transactionStockListFetchAction = (filter, id) => {
    const params = serializers.listFilterSerializer(filter.getParams(), id)
    const payload = axios()
        .get(API.TRANSACTION_STOCK_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_STOCK_LIST,
        payload
    }
}
