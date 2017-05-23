import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/manufactureProductSerializer'

export const manufactureProductCreateAction = (formValues, manufactureId) => {
    const requestData = serializers.createSerializer(formValues, manufactureId)

    const payload = axios()
        .post(API.MANUFACTURE_PRODUCT_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MANUFACTURE_PRODUCT_CREATE,
        payload
    }
}

export const manufactureProductDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.MANUFACTURE_PRODUCT_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MANUFACTURE_PRODUCT_DELETE,
        payload
    }
}

export const manufactureProductUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.MANUFACTURE_PRODUCT_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MANUFACTURE_PRODUCT_UPDATE,
        payload
    }
}

export const manufactureProductListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.MANUFACTURE_PRODUCT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MANUFACTURE_PRODUCT_LIST,
        payload
    }
}

export const manufactureProductCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.MANUFACTURE_PRODUCT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MANUFACTURE_PRODUCT_LIST_CSV,
        payload
    }
}

export const manufactureProductItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.MANUFACTURE_PRODUCT_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MANUFACTURE_PRODUCT_ITEM,
        payload
    }
}

