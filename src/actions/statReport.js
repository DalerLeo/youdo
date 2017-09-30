import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statReportSerializer'
import fileDownload from 'react-file-download'

export const statReportListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_REPORT_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_REPORT_LIST,
        payload
    }
}
export const getDocumentAction = () => {
    const payload = axios()
        .get(sprintf(API.STAT_OUTCOME_GET_DOCUMENT))
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

