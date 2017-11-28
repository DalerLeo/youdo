import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/remainderSerializer'

export const remainderListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.REMAINDER_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_LIST,
        payload
    }
}
export const remainderReversedListFetchAction = (id, page, stock) => {
    const payload = axios()
        .get(API.REMAINDER_RESERVED, {params: {product: id, page: page, stock: stock}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_RESERVED,
        payload
    }
}

export const remainderItemFetchAction = (id, filter) => {
    const params = serializers.itemFilterSerializer(filter.getParams())
    const payload = axios()
        .get(sprintf(API.REMAINDER_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_ITEM,
        payload
    }
}

export const remainderTransferAction = (formValues) => {
    const requestData = serializers.transferSerializer(formValues)

    const payload = axios()
        .post(API.REMAINDER_TRANSFER, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_TRANSFER,
        payload
    }
}

export const remainderDiscardAction = (formValues) => {
    const requestData = serializers.discardSerializer(formValues)

    const payload = axios()
        .post(API.REMAINDER_DISCARD, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.REMAINDER_DISCARD,
        payload
    }
}

export const addProductsListAction = (filter, productType, stock) => {
    const params = {
        page_size: _.get(filter.getParams(), 'pdPageSize'),
        page: _.get(filter.getParams(), 'pdPage'),
        search: _.get(filter.getParams(), 'pdSearch'),
        type: productType,
        stock
    }
    const payload = axios()
        .get(API.REMAINDER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_ADD_PRODUCTS,
        payload
    }
}

