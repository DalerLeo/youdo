import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/trackingSerializer'

export const trackingListFetchAction = () => {
    const payload = axios()
        .get(API.TRACKING_LIST)
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

export const locationListAction = (id, date) => {
    const params = serializers.agentLocationSerializer(id, date)
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

