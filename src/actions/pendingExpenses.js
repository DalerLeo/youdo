import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/pendingExpensesSerializer'

export const pendingExpensesUpdateAction = (detail, formValues) => {
    const requestData = serializers.createSerializer(formValues, detail)
    const payload = axios()
        .post(API.PENDING_EXPENSES_UPDATE, requestData)
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
