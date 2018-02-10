import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/returnSerializer'

const CLIENT_RETURN = 2
export const returnCancelAction = (id) => {
    const payload = axios()
        .post(sprintf(API.RETURN_CANCEL, id), {})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_CANCEL,
        payload
    }
}

export const returnListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.RETURN_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.RETURN_LIST,
        payload
    }
}

export const returnListPrintFetchAction = (id, filter) => {
    const orderReturns = id || _.get(filter.getParams(), 'select')
    const payload = axios()
        .get(API.RETURN_PRINT, {'params': {ids: orderReturns}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_PRINT,
        payload
    }
}

export const returnItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.RETURN_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_ITEM,
        payload
    }
}

export const returnUpdateAction = (id, formValues, detail) => {
    const requestData = serializers.updateSerializer(formValues, detail, CLIENT_RETURN)
    const payload = axios()
        .put(sprintf(API.RETURN_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.RETURN_UPDATE,
        payload
    }
}

export const clientReturnUpdateAction = (id, formValues, detail) => {
    const requestData = serializers.updateSerializer(formValues, detail, CLIENT_RETURN)
    const payload = axios()
        .put(sprintf(API.CLIENT_TRANSACTION_RETURN_UPDATE, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.RETURN_UPDATE_CLIENT,
        payload
    }
}

export const clientReturnAction = (formValues, id) => {
    const requestData = serializers.createReturnSerializer(formValues, id)
    const payload = axios()
        .post(API.CLIENT_TRANSACTION_RETURN, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_RETURN,
        payload
    }
}

export const addProductsListAction = (filter, type, market, currency, client) => {
    const params = {
        page_size: _.get(filter.getParams(), 'pdPageSize'),
        page: _.get(filter.getParams(), 'pdPage'),
        search: _.get(filter.getParams(), 'pdSearch'),
        type,
        market,
        currency,
        client
    }
    const payload = axios()
        .get(API.RETURN_CREATE_PRODUCTS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_PRODUCT_ADD,
        payload
    }
}

export const returnPreviewAction = (formValues) => {
    const requestData = serializers.createReturnSerializer(formValues)
    const payload = axios()
        .post(API.RETURN_PREVIEW, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_PREVIEW,
        payload
    }
}

