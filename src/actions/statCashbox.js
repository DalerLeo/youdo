import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/statCashboxSerializer'

export const statCashboxListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STAT_CASHBOX_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_CASHBOX_LIST,
        payload
    }
}

export const statCashboxItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STAT_CASHBOX_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_CASHBOX_ITEM,
        payload
    }
}

export const statCashBoxSumDataFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STAT_CASHBOX_SUM, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_CASHBOX_SUM,
        payload
    }
}

export const statCashBoxItemDataFetchAction = (filter, id) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_CASHBOX_DATA_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_CASHBOX_DATA_ITEM,
        payload
    }
}
