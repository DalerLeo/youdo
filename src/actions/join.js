import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/joinSerializer'

export const joinMarketsAction = (formValues) => {
    const requestData = serializers.marketSerializer(formValues)
    const payload = axios()
        .post(API.JOIN_MARKETS, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.JOIN_MARKETS,
        payload
    }
}

export const joinClientsAction = (formValues) => {
    const requestData = serializers.clientSerializer(formValues)
    const payload = axios()
        .post(API.JOIN_CLIENTS, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.JOIN_CLIENTS,
        payload
    }
}