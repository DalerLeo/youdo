import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/currencySerializer'

export const courseCreateAction = (formValues, currency) => {
    const requestData = serializers.courseSerializer(formValues, currency)
    const payload = axios()
        .post(API.CURRENCY_COURSE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CURRENCY_COURSE_CREATE,
        payload
    }
}

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

export const currencyItemFetchAction = (filter, id) => {
    const params = serializers.itemSerializer(filter.getParams(), id)
    const payload = axios()
        .get(API.CURRENCY_RATE, {params})
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
