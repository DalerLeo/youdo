import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/statStockSerializer'
import fileDownload from 'react-file-download'

export const statStockListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STATSTOCK_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATSTOCK_LIST,
        payload
    }
}

export const statStockDataFetchAction = (id) => {
    const params = (id) ? {stock: id} : {}
    const payload = axios()
        .post(API.STATSTOCK_DATA, params)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATSTOCK_DATA,
        payload
    }
}

export const getDocumentAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STATSTOCK_GET_DOCUMENT), {params})
        .then((response) => {
            fileDownload(response.data, 'договор.xls')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATSTOCK_GET_DOCUMENT,
        payload
    }
}
