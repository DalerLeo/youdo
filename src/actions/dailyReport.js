import _ from 'lodash'
import * as API from '../constants/api'
import axios from '../helpers/axios'
import * as actionTypes from '../constants/actionTypes'
import {csvFilterSerializer, listFilterSerializer} from '../serializers/dailyReportSerializer'

export const dailyReportListFetchAction = (filter) => {
    const params = listFilterSerializer(filter.getParams())
    const payload = axios().get(API.DAILY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.DAILY_REPORT_LIST,
        payload
    }
}

export const dailyReportCSVFetchAction = (filter) => {
    const params = csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.DAILY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.DAILY_REPORT_LIST_CSV,
        payload
    }
}
