import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/activitySerializer'

export const VISIT = 1
export const ORDER = 2
export const REPORT = 3
export const ORDER_RETURN = 4
export const PAYMENT = 5
export const DELIVERY = 6

const thumbnailType = 'medium'

// ORDER

export const activityOrderListFetchAction = (filter, page) => {
    const params = serializers.listFilterSerializer(filter.getParams(), ORDER, page)
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

export const activityVisitListFetchAction = (filter, page) => {
    const params = serializers.listFilterSerializer(filter.getParams(), VISIT, page)
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

export const activityReportListFetchAction = (filter, page) => {
    const params = serializers.listFilterSerializer(filter.getParams(), REPORT, page, thumbnailType)
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

export const activityReturnListFetchAction = (filter, page) => {
    const params = serializers.listFilterSerializer(filter.getParams(), ORDER_RETURN, page)
    const payload = axios()
        .get(API.ACTIVITY_ORDER_RETURN_LIST, {params})
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

export const activityPaymentListFetchAction = (filter, page) => {
    const params = serializers.listFilterSerializer(filter.getParams(), PAYMENT, page)
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

export const activityDeliveryListFetchAction = (filter, page) => {
    const params = serializers.listFilterSerializer(filter.getParams(), DELIVERY, page)
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

// SUMMARY

export const activitySummaryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.ACTIVITY_SUMMARY, {params})
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
