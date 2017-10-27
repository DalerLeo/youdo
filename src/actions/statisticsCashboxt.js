import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statCashboxSerializer'

export const statCashboxListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STATISTICS_CASHBOX_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_LIST,
        payload
    }
}

export const statCashboxItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STATISTICS_CASHBOX_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CASHBOX_ITEM,
        payload
    }
}

