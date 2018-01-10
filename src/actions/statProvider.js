import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statProviderSerializer'

export const statProviderListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_PROVIDER_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PROVIDER_LIST,
        payload
    }
}

export const statProviderSummaryFetchAction = (filter) => {
    const params = serializers.summaryFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_PROVIDER_SUM), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PROVIDER_SUM,
        payload
    }
}

export const statProviderItemFetchAction = (filter, id, division, type) => {
    const params = serializers.itemFilterSerializer(filter.getParams(), id, division, type)
    const payload = axios()
        .get(API.STAT_PROVIDER_ITEM, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PROVIDER_ITEM,
        payload
    }
}
