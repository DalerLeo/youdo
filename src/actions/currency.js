import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/currencySerializer'

export const currencyCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.CURRENCY_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_CREATE,
        payload
    }
}

export const currencyDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.CURRENCY_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_DELETE,
        payload
    }
}

export const currencyUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.CURRENCY_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_UPDATE,
        payload
    }
}

export const currencyListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.CURRENCY_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_LIST,
        payload
    }
}

export const currencyCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.CURRENCY_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_LIST_CSV,
        payload
    }
}

export const currencyItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.CURRENCY_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_ITEM,
        payload
    }
}

export const currencyPrimaryFetchAction = () => {
    const payload = axios()
        .get(API.CURRENCY_PRIMARY)
        .then((response) => {
            return response
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response']))
        })

    return {
        type: actionTypes.CURRENCY_PRIMARY,
        payload
    }
}

export const currencyPrimaryCreateAction = (formValues) => {
    const requestData = serializers.createPrimarySerializer(formValues)
    const payload = axios()
        .post(sprintf(API.CURRENCY_PRIMARY_CREATE), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_PRIMARY_UPDATE,
        payload
    }
}

export const setCurrencyCreateAction = (formValues, currency) => {
    const requestData = serializers.setCurrencySerializer(formValues, currency)
    const payload = axios()
        .post(sprintf(API.SET_CURRENCY_CREATE), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SET_CURRENCY_UPDATE,
        payload
    }
}
