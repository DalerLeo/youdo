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

export const statMarketItemFetchAction = (filter, id) => {
    const params = serializers.itemSerializer(filter.getParams(), id)
    const payload = axios()
        .get(sprintf(API.STAT_MARKET_ITEM), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_MARKET_ITEM,
        payload
    }
}

export const getDocumentAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_MARKET_GET_DOCUMENT), {params})
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
