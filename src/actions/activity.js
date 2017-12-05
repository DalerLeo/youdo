import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/activitySerializer'

const CancelToken = axios().CancelToken

export const VISIT = 1
export const ORDER = 2
export const REPORT = 3
export const ORDER_RETURN = 4
export const PAYMENT = 5
export const DELIVERY = 6

const thumbnailType = 'medium'

// ORDER
let activityOrderListFetchToken = null
export const activityOrderListFetchAction = (filter, page) => {
    if (activityOrderListFetchToken) {
        activityOrderListFetchToken.cancel()
    }
    activityOrderListFetchToken = CancelToken.source()
    const params = serializers.listFilterSerializer(filter.getParams(), ORDER, page)
    const payload = axios()
        .get(API.ACTIVITY_ORDER_LIST, {params, cancelToken: activityOrderListFetchToken.token})
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
let activityVisitListFetchToken = null
export const activityVisitListFetchAction = (filter, page) => {
    if (activityVisitListFetchToken) {
        activityVisitListFetchToken.cancel()
    }
    activityVisitListFetchToken = CancelToken.source()
    const params = serializers.listFilterSerializer(filter.getParams(), VISIT, page)
    const payload = axios()
        .get(API.ACTIVITY_VISIT_LIST, {params, cancelToken: activityVisitListFetchToken.token})
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
let activityReportListFetchToken = null
export const activityReportListFetchAction = (filter, page) => {
    if (activityReportListFetchToken) {
        activityReportListFetchToken.cancel()
    }
    activityReportListFetchToken = CancelToken.source()
    const params = serializers.listFilterSerializer(filter.getParams(), REPORT, page, thumbnailType)
    const payload = axios()
        .get(API.ACTIVITY_REPORT_LIST, {params, cancelToken: activityReportListFetchToken.token})
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
export const activityReportShowImageAction = (id) => {
    const params = {'thumbnail_type': 'large'}
    const payload = axios()
        .get(sprintf(API.ACTIVITY_REPORT_SHOW_IMAGE, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ACTIVITY_REPORT_SHOW_IMAGE,
        payload
    }
}

// ORDER_RETURN
let activityReturnListFetchToken = null
export const activityReturnListFetchAction = (filter, page) => {
    if (activityReturnListFetchToken) {
        activityReturnListFetchToken.cancel()
    }
    activityReturnListFetchToken = CancelToken.source()
    const params = serializers.listFilterSerializer(filter.getParams(), ORDER_RETURN, page)
    const payload = axios()
        .get(API.ACTIVITY_ORDER_RETURN_LIST, {params, cancelToken: activityReturnListFetchToken.token})
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
let activityPaymentListFetchToken = null
export const activityPaymentListFetchAction = (filter, page) => {
    if (activityPaymentListFetchToken) {
        activityPaymentListFetchToken.cancel()
    }
    activityPaymentListFetchToken = CancelToken.source()
    const params = serializers.listFilterSerializer(filter.getParams(), PAYMENT, page)
    const payload = axios()
        .get(API.ACTIVITY_REPORT_LIST, {params, cancelToken: activityPaymentListFetchToken.token})
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
let activityDeliveryListFetchToken = null
export const activityDeliveryListFetchAction = (filter, page) => {
    if (activityDeliveryListFetchToken) {
        activityDeliveryListFetchToken.cancel()
    }
    activityDeliveryListFetchToken = CancelToken.source()
    const params = serializers.listFilterSerializer(filter.getParams(), DELIVERY, page)
    const payload = axios()
        .get(API.ACTIVITY_REPORT_LIST, {params, cancelToken: activityDeliveryListFetchToken.token})
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

// SUMMARY
let activitySummaryListFetchToken = null
export const activitySummaryListFetchAction = (filter) => {
    if (activitySummaryListFetchToken) {
        activitySummaryListFetchToken.cancel()
    }
    activitySummaryListFetchToken = CancelToken.source()
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.ACTIVITY_SUMMARY, {params, cancelToken: activitySummaryListFetchToken.token})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.ACTIVITY_SUMMARY,
        payload
    }
}
