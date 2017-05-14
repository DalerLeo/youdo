import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/supplyExpenseSerializer'

export const supplyExpenseCreateAction = (formValues, id) => {
    const requestData = serializers.createSerializer(formValues, id)
    const payload = axios()
        .post(API.SUPPLY_EXPENSE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_EXPENSE_CREATE,
        payload
    }
}

export const supplyExpenseDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.SUPPLY_EXPENSE_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_EXPENSE_DELETE,
        payload
    }
}

export const supplyExpenseListFetchAction = (supplyId) => {
    const params = serializers.expenseSupplySerializer(supplyId)
    const payload = axios()
        .get(API.SUPPLY_EXPENSE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_EXPENSE_LIST,
        payload
    }
}

export const supplyExpenseCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.SUPPLY_EXPENSE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_EXPENSE_LIST_CSV,
        payload
    }
}

export const supplyExpenseItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.SUPPLY_EXPENSE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_EXPENSE_ITEM,
        payload
    }
}
