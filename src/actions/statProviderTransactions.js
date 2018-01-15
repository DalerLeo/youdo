import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statProviderTransactionsSerializer'

export const providerTransactionsOutDataFetchAction = (filter) => {
    const type = {amount_type: 'expanse'}
    const params = serializers.graphSerializer(filter.getParams())
    const payload = axios()
        .get(API.STAT_PROVIDER_TRANSACTIONS_SUM, {params: _.merge(type, params)})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PROVIDER_TRANSACTIONS_OUT,
        payload
    }
}

export const providerTransactionsInDataFetchAction = (filter) => {
    const type = {amount_type: 'income'}
    const params = serializers.graphSerializer(filter.getParams())
    const payload = axios()
        .get(API.STAT_PROVIDER_TRANSACTIONS_SUM, {params: _.merge(type, params)})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PROVIDER_TRANSACTIONS_IN,
        payload
    }
}

export const providerTransactionsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_PROVIDER_TRANSACTIONS_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PROVIDER_TRANSACTIONS_LIST,
        payload
    }
}