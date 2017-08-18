import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statMarketSerializer'
import fileDownload from 'react-file-download'

export const statMarketListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STAT_MARKET_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_MARKET_LIST,
        payload
    }
}

export const getDocumentAction = () => {
    const payload = axios()
        .get(sprintf(API.STAT_MARKET_GET_DOCUMENT))
        .then((response) => {
            fileDownload(response.data, 'договор.xls')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_MARKET_GET_DOCUMENT,
        payload
    }
}
export const statMarketDataFetchAction = (market) => {
    const payload = axios()
        .get(sprintf(API.STAT_MARKET_DATA), {'params': {'market': market}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_MARKET_DATA,
        payload
    }
}

export const statMarketSumFetchAction = (filter) => {
    const params = serializers.sumFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_MARKET_SUM), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_MARKET_SUM,
        payload
    }
}
