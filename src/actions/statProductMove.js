import _ from 'lodash'
import sprintf from 'sprintf'
import fileDownload from 'react-file-download'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statProductMoveSerializer'

export const statProductMoveListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_PRODUCT_MOVE_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PRODUCT_MOVE_LIST,
        payload
    }
}

export const statProductMoveSumFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STAT_PRODUCT_MOVE_SUM, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PRODUCT_MOVE_SUM,
        payload
    }
}

export const getDocumentAction = () => {
    const payload = axios()
        .get(sprintf(API.STAT_PRODUCT_GET_DOCUMENT))
        .then((response) => {
            fileDownload(response.data, 'document.xlsx')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_PRODUCT_GET_DOCUMENT,
        payload
    }
}
