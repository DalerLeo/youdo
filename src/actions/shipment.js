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

export const shipmentProductsListFetchAction = (id) => {
    const payload = axios()
        .get(API.SHIPMENT_PRODUCTS_LIST, {params: {personal_rotation: id}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_PRODUCTS_LIST,
        payload
    }
}

export const shipmentMaterialsListFetchAction = (id) => {
    const payload = axios()
        .get(API.SHIPMENT_MATERIALS_LIST, {params: {personal_rotation: id}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_MATERIALS_LIST,
        payload
    }
}
