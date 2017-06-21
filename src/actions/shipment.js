import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/shipmentSerializer'

export const shipmentListFetchAction = (filter, manufacture) => {
    const params = serializers.listFilterSerializer(filter.getParams(), manufacture)
    const payload = axios()
        .get(API.SHIPMENT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_LIST,
        payload
    }
}

export const shipmentCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.SHIPMENT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_LIST_CSV,
        payload
    }
}

export const shipmentItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.SHIPMENT_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_ITEM,
        payload
    }
}
