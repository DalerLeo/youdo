import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statRemainderSerializer'
import fileDownload from 'react-file-download'

export const statRemainderItemFetchAction = (filterItem, id) => {
    const params = serializers.itemFilterSerializer(filterItem.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_REMAINDER_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_REMAINDER_ITEM,
        payload
    }
}
export const statRemainderListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_REMAINDER_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_REMAINDER_LIST,
        payload
    }
}
export const getDocumentAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_OUTCOME_GET_DOCUMENT), {params})
        .then((response) => {
            fileDownload(response.data, 'договор.xls')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_OUTCOME_GET_DOCUMENT,
        payload
    }
}

