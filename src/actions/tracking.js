import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/trackingSerializer'

export const trackingListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.TRACKING_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRACKING_LIST,
        payload
    }
}

export const marketsLocationFetchAction = () => {
    const payload = axios()
        .get(API.MARKETS_LOCATION)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MARKETS_LOCATION,
        payload
    }
}

export const locationListAction = (id, data) => {
    const params = serializers.agentLocationSerializer(id, data)
    const payload = axios()
        .get(API.LOCATION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.LOCATION_LIST,
        payload
    }
}

