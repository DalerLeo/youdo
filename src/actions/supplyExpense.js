import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Supply/supplyExpenseSerializer'

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
