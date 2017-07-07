import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statAgentSerializer'

export const statAgentListFetchAction = (filter, id) => {
    const params = serializers.listFilterSerializer(filter.getParams(), id)
    const payload = axios()
        .get((API.STATISTICS_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_LIST,
        payload
    }
}

export const statAgentItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STATISTICS_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATISTICS_ITEM,
        payload
    }
}
