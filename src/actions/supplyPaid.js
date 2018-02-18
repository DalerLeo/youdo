import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Supply/supplyExpenseSerializer'

export const supplyPaidListFetchAction = (supplyId, filter) => {
    const params = serializers.supplyPaidSerializer(supplyId, filter.getParams())
    const payload = axios()
        .get(API.SUPPLY_PAID_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_PAID_LIST,
        payload
    }
}
