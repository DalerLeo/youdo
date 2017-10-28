import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statReturnSerializer'

export const returnDataSumFetchAction = (filter) => {
    const params = serializers.returnGraphSerializer(filter.getParams())
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
