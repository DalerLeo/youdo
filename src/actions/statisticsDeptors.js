import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statDebtorsSerializer'

export const statDebtorsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_DEBTORS_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_LIST,
        payload
    }
}

export const statDebtorsDataFetchAction = () => {
    const payload = axios()
        .get(API.STAT_DEBTORS_DATA)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_DATA,
        payload
    }
}

export const statDebtorsItemFetchAction = (filter, filterItem, id) => {
    const params = serializers.itemSerializer(filter.getParams(), filterItem.getParams(), id)
    const payload = axios()
        .get(sprintf(API.STAT_DEBTORS_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_ITEM,
        payload
    }
}
