import _ from 'lodash'
import sprintf from 'sprintf'
import fileDownload from 'react-file-download'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statAgentSerializer'

export const statAgentListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_AGENT_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_AGENT_LIST,
        payload
    }
}

export const statAgentItemFetchAction = (filter, filterItem, id) => {
    const params = serializers.itemSerializer(filter.getParams(), filterItem.getParams(), id)
    const payload = axios()
        .get(sprintf(API.STAT_AGENT_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_AGENT_ITEM,
        payload
    }
}

export const getDocumentAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.STAT_AGENT_GET_DOCUMENT), {params})
        .then((response) => {
            fileDownload(response.data, 'document.xlsx')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_AGENT_GET_DOCUMENT,
        payload
    }
}
