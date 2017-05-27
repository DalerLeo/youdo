import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/productSerializer'

export const productCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.PRODUCT_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_CREATE,
        payload
    }
}

export const productDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.PRODUCT_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_DELETE,
        payload
    }
}

export const productUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.PRODUCT_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_UPDATE,
        payload
    }
}

export const productListFetchAction = (filter, manufacture) => {
    const params = serializers.listFilterSerializer(filter.getParams(), manufacture)
    const payload = axios()
        .get(API.PRODUCT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_LIST,
        payload
    }
}

export const productCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PRODUCT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_LIST_CSV,
        payload
    }
}

export const productItemFetchAction = (id) => {
    const params = {'thumbnail_type': 'large'}
    const payload = axios()
        .get(sprintf(API.PRODUCT_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_ITEM,
        payload
    }
}
