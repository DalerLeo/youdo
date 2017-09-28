import _ from 'lodash'
import axios from '../helpers/axios'
import fileDownload from 'react-file-download'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statClientIncomeSerializer'

export const clientIncomeOutDataFetchAction = () => {
    const payload = axios()
        .get(API.STAT_CLIENT_INCOME_LIST, {params: {'type': 'expense'}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_CLIENT_INCOME_OUT,
        payload
    }
}

export const clientIncomeInDataFetchAction = () => {
    const payload = axios()
        .get(API.STAT_CLIENT_INCOME_LIST, {params: {'type': 'income'}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_CLIENT_INCOME_IN,
        payload
    }
}

export const clientIncomeListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.CLIENT_TRANSACTION_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_CLIENT_INCOME_LIST,
        payload
    }
}

export const getDocumentAction = () => {
    const payload = axios()
        .get(API.STAT_CLIENT_INCOME_GET_DOCUMENT)
        .then((response) => {
            fileDownload(response.data, 'transactions.xlsx')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        payload
    }
}