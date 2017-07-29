import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/activitySerializer'

const VISIT = 1
const ORDER = 2
const REPORT = 3
const ORDER_RETURN = 4
const PAYMENT = 5
const DELIVERY = 6

const thumbnailType = 'medium'

// ORDER

export const activityOrderListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams(), ORDER)
    const payload = axios()
        .get(API.ACTIVITY_ORDER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ACTIVITY_ORDER_LIST,
        payload
    }
}

export const activityOrderItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.ACTIVITY_ORDER_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ACTIVITY_ORDER_ITEM,
        payload
    }
}

// VISIT

export const activityVisitListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams(), VISIT)
    const payload = axios()
        .get(API.ACTIVITY_VISIT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ACTIVITY_VISIT_LIST,
        payload
    }
}

// REPORT

export const activityReportListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams(), REPORT, thumbnailType)
    const payload = axios()
        .get(API.ACTIVITY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ACTIVITY_REPORT_LIST,
        payload
    }
}

// ORDER_RETURN

export const activityReturnListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams(), ORDER_RETURN)
    const payload = axios()
        .get(API.ACTIVITY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ACTIVITY_ORDER_RETURN_LIST,
        payload
    }
}

// PAYMENT

export const activityPaymentListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams(), PAYMENT)
    const payload = axios()
        .get(API.ACTIVITY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ACTIVITY_PAYMENT_LIST,
        payload
    }
}

// DELIVERY

export const activityDeliveryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams(), DELIVERY)
    const payload = axios()
        .get(API.ACTIVITY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ACTIVITY_DELIVERY_LIST,
        payload
    }
}

