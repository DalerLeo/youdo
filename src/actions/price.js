import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/priceSerializer'
export const priceCreateAction = (formValues, productId, priceList) => {
    const requestData = serializers.createSerializer(formValues, productId, priceList)
    const payload = axios()
        .post(API.PRICE_LIST_ITEM_ADD, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_CREATE,
        payload
    }
}
export const priceSetDefaultAction = (product, cost) => {
    const payload = axios()
        .post(API.PRICE_ITEM_SET_DEFAULT, {product, cost})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_SET_DEFAULT,
        payload
    }
}
export const priceListFetchAction = (filter, manufacture) => {
    const params = serializers.listFilterSerializer(filter.getParams(), manufacture)
    const payload = axios()
        .get(API.PRICE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_LIST,
        payload
    }
}
export const priceItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PRICE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_ITEM,
        payload
    }
}
export const getPriceItemsAction = (id) => {
    const params = {
        'product': id
    }
    const payload = axios()
        .get(API.PRICE_LIST_ITEM_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_LIST_ITEM_LIST,
        payload
    }
}

export const priceItemHistoryFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PRICE_LIST_ITEM_HISTORY, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_LIST_ITEM_HISTORY,
        payload
    }
}

export const priceItemExpensesFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PRICE_LIST_ITEM_EXPENSES, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_LIST_ITEM_EXPENSES,
        payload
    }
}
export const setPriceCreateFetchAction = (formValues) => {
    const requestData = serializers.setPricesSerializer(formValues)
    const payload = axios()
        .post(API.SET_PRICE_LIST, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SET_PRICE_LIST,
        payload
    }
}

export const setPriceProductListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.PRODUCT_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRICE_PRODUCT_LIST,
        payload
    }
}
export const setPricePriceListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.PRICE_LIST_SETTING_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRICE_PRICE_LIST,
        payload
    }
}
