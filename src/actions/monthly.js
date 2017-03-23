import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/monthlySerializer'

export const monthlyReportListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.MONTHLY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MONTHLY_REPORT_LIST,
        payload
    }
}

export const monthlyReportCreateAction = (formValues) => {
    const data = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.MONTHLY_REPORT_LIST, data)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.MONTHLY_REPORT_CREATE,
        payload
    }
}

export const monthlyReportItemFetchAction = (monthlyReportId) => {
    const url = sprintf(API.MONTHLY_REPORT_ITEM, monthlyReportId)
    const payload = axios()
        .get(url)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.MONTHLY_REPORT_ITEM,
        payload
    }
}

export const monthlyReportItemEditAction = (monthlyReportId, formValues) => {
    const url = sprintf(API.MONTHLY_REPORT_EDIT, monthlyReportId)
    const data = serializers.createSerializer(formValues)
    const payload = axios()
        .put(url, data)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.MONTHLY_REPORT_EDIT,
        payload
    }
}

export const monthlyReportItemDeleteAction = (monthlyReportId) => {
    const url = sprintf(API.MONTHLY_REPORT_DELETE, monthlyReportId)
    const payload = axios()
        .delete(url)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.MONTHLY_REPORT_DELETE,
        payload
    }
}

export const monthlyReportCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.MONTHLY_REPORT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MONTHLY_REPORT_LIST_CSV,
        payload
    }
}
