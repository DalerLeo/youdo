import _ from 'lodash'
import * as API from '../constants/api'
import axios from '../helpers/axios'
import * as actionTypes from '../constants/actionTypes'
import {pieChartFilterSerializer, lineChartFilterSerializer} from '../serializers/dashboardSerializer'

export const dashboardStaticsPieFetchAction = (filter) => {
    const params = pieChartFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STATICS_ALL_PROFIT_AND_LOSS, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.DASHBOARD_CHART_PIE,
        payload
    }
}

export const dashboardStaticsLineFetchAction = (filter) => {
    const params = lineChartFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STATICS_DAY_BY_PROFIT_AND_LOSS, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.DASHBOARD_CHART_LINE,
        payload
    }
}
