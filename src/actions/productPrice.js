import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Product/productPriceSerializer'

export const productPriceCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.PRODUCT_PRICE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_PRICE_CREATE,
        payload
    }
}

export const productPriceDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.PRODUCT_PRICE_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_PRICE_DELETE,
        payload
    }
}

export const productPriceUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues, id)
    const payload = axios()
        .post(sprintf(API.PRODUCT_PRICE_SET, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_PRICE_UPDATE,
        payload
    }
}

export const productPriceListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PRODUCT_PRICE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_PRICE_LIST,
        payload
    }
}

export const productPriceCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PRODUCT_PRICE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_PRICE_LIST_CSV,
        payload
    }
}

export const productPriceItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PRODUCT_PRICE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_PRICE_ITEM,
        payload
    }
}
