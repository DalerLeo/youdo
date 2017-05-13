import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/productTypeSerializer'

export const productTypeCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.PRODUCT_TYPE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_TYPE_CREATE,
        payload
    }
}

export const productTypeDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.PRODUCT_TYPE_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRODUCT_TYPE_DELETE,
        payload
    }
}

export const productTypeUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.PRODUCT_TYPE_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_TYPE_UPDATE,
        payload
    }
}

export const productTypeListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PRODUCT_TYPE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_TYPE_LIST,
        payload
    }
}

export const productTypeCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PRODUCT_TYPE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_TYPE_LIST_CSV,
        payload
    }
}

export const productTypeItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PRODUCT_TYPE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_TYPE_ITEM,
        payload
    }
}