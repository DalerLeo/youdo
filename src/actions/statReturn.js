import _ from 'lodash'
import fileDownload from 'react-file-download'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statAgentSerializer'

export const statReturnDataFetchAction = (filter) => {
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

export const getDocumentAction = () => {
    const payload = axios()
        .get(API.STAT_RETURN_GET_DOCUMENT)
        .then((response) => {
            fileDownload(response.data, 'document.xlsx')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_RETURN_GET_DOCUMENT,
        payload
    }
}
