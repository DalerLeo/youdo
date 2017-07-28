import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'

export const statSalesDataFetchAction = () => {
    const payload = axios()
        .get(API.STAT_SALES_DATA)
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
