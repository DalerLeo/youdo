import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/shipmentSerializer'

export const shipmentListFetchAction = (filter, manufacture, dateRange) => {
    const params = serializers.listFilterSerializer(filter.getParams(), manufacture, dateRange)
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

export const shipmentLogsListFetchAction = (filter, manufacture, dateRange) => {
    const params = serializers.logsFilterSerializer(filter.getParams(), manufacture, dateRange)
    const payload = axios()
        .get(API.SHIPMENT_LOGS, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_LOGS,
        payload
    }
}

export const shipmentProductsListFetchAction = (dateRange) => {
    const beginDate = _.get(dateRange, 'beginDate')
    const endDate = _.get(dateRange, 'endDate')
    const payload = axios()
        .get(API.SHIPMENT_PRODUCTS_LIST, {params: {begin_date: beginDate, end_date: endDate}})
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

export const shipmentMaterialsListFetchAction = (dateRange) => {
    const beginDate = _.get(dateRange, 'beginDate')
    const endDate = _.get(dateRange, 'endDate')
    const payload = axios()
        .get(API.SHIPMENT_MATERIALS_LIST, {params: {begin_date: beginDate, end_date: endDate}})
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
