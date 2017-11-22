import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/dashboardSerializer'

export const statSalesDataFetchAction = (filter) => {
    const params = serializers.orderChart(filter.getParams())
    const payload = axios()
        .get(API.STAT_SALES_DATA, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_SALES_DATA,
        payload
    }
}
