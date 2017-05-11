import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/pendingExpensesSerializer'

export const pendingExpensesCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.PENDING_EXPENSES_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_EXPENSES_CREATE,
        payload
    }
}

export const pendingExpensesDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.PENDING_EXPENSES_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_EXPENSES_DELETE,
        payload
    }
}

export const pendingExpensesUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.PENDING_EXPENSES_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_EXPENSES_UPDATE,
        payload
    }
}

export const pendingExpensesListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PENDING_EXPENSES_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_EXPENSES_LIST,
        payload
    }
}

export const pendingExpensesCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PENDING_EXPENSES_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_EXPENSES_LIST_CSV,
        payload
    }
}

export const pendingExpensesItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PENDING_EXPENSES_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_EXPENSES_ITEM,
        payload
    }
}
