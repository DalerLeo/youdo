import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as returnSerializers from '../serializers/returnSerializer'

export const returnDataSumFetchAction = (filter) => {
    const params = returnSerializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_RETURN_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_RETURN_LIST,
        payload
    }
}

export const returnDataSumDetailsFetchAction = (filter) => {
    const params = returnSerializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_RETURN_SUM_DETAILS), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_RETURN_SUM_DETAILS,
        payload
    }
}
