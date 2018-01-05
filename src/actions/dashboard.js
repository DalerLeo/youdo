import _ from 'lodash'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/dashboardSerializer'

export const statSalesDataFetchAction = (filter) => {
    const params = serializers.orderChart(filter.getParams())
    const payload = axios()
        .get(API.STAT_SALES_DATA, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_SALES_DATA,
        payload
    }
}

export const statSalesReturnDataFetchAction = (filter) => {
    const params = serializers.returnChart(filter.getParams())
    const payload = axios()
        .get(API.STAT_RETURN_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_RETURN_LIST,
        payload
    }
}

export const statAgentDataFetchAction = (filter) => {
    const params = serializers.agentsChart(filter.getParams())
    const payload = axios()
        .get((API.STAT_AGENT_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_AGENT_LIST,
        payload
    }
}

export const statFinanceIncomeFetchAction = (filter) => {
    const params = serializers.incomeFinance(filter.getParams())
    const payload = axios()
        .get(API.STAT_FINANCE_DATA, {params, type: 'income'})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_FINANCE_DATA_IN,
        payload
    }
}

export const statFinanceExpenseFetchAction = (filter) => {
    const params = serializers.expenseFinance(filter.getParams())
    const payload = axios()
        .get(API.STAT_FINANCE_DATA, {params, type: 'expense'})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_FINANCE_DATA_OUT,
        payload
    }
}

export const widgetsListFetchAction = () => {
    const payload = axios()
        .get(API.WIDGETS_LIST)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.WIDGETS_LIST,
        payload
    }
}

export const changePasswordFetchAction = (formValues) => {
    const requestData = serializers.passwordSerializer(formValues)
    const payload = axios()
        .post(API.DASHBOARD_CHANGE_PASSWORD, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.DASHBOARD_CHANGE_PASSWORD,
        payload
    }
}
