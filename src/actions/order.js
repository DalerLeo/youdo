import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/orderSerializer'
import * as returnSerializers from '../serializers/orderReturnSerializer'

const MINUS_ONE = -1
const ONE = 1
export const orderCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)

    const payload = axios()
        .post(API.ORDER_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_CREATE,
        payload
    }
}

export const orderReturnCancelAction = (id) => {
    const payload = axios()
        .post(sprintf(API.ORDER_RETURN_CANCEL, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_RETURN_CANCEL,
        payload
    }
}

export const orderReturnAction = (formValues, detail) => {
    const requestData = returnSerializers.createSerializer(formValues, detail)
    const payload = axios()
        .post(API.ORDER_RETURN, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_RETURN,
        payload
    }
}

export const orderReturnListAction = (id) => {
    const payload = axios()
        .get(sprintf(API.ORDER_RETURN_LIST, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_RETURN_LIST,
        payload
    }
}

export const orderDeleteAction = (id) => {
    const payload = axios()
        .post(sprintf(API.ORDER_CANCEL, id), {})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_DELETE,
        payload
    }
}

export const orderUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.ORDER_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_UPDATE,
        payload
    }
}

export const orderListFetchAction = (filter, withOrderReturn) => {
    const params = serializers.listFilterSerializer(filter.getParams(), null, withOrderReturn, null)
    const payload = axios()
        .get(API.ORDER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_LIST,
        payload
    }
}

export const orderListPintFetchAction = (filter, id) => {
    const print = true
    const params = serializers.listFilterSerializer(filter.getParams(), id, null, print)
    const payload = axios()
        .get(API.ORDER_LIST_PRINT, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_LIST_PRINT,
        payload
    }
}
export const orderSalesPrintFetchAction = (orders) => {
    const payload = axios()
        .get(API.ORDER_SALES_PRINT, {params: {orders}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_SALES_PRINT,
        payload
    }
}

export const orderTransactionFetchAction = (orderId) => {
    const params = {order: orderId}
    const payload = axios()
        .get(API.ORDER_PAYMENTS, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_PAYMENTS,
        payload
    }
}

export const orderItemReturnFetchAction = (orderId) => {
    const payload = axios()
        .get(API.ORDER_RETURN, {params: {'order': orderId}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_RETURN,
        payload
    }
}

export const orderItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.ORDER_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_ITEM,
        payload
    }
}
export const orderSetDiscountAction = (id, percent) => {
    const payload = axios()
        .post(sprintf(API.ORDER_SET_DISCOUNT, id), {'discount_price': _.toNumber(percent)})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_SET_DISCOUNT,
        payload
    }
}

export const orderProductMobileAction = (orderId, priceList, size, products) => {
    const payload = axios()
        .get(API.PRODUCT_MOBILE_URL, {'params': {'order': orderId, 'price_list': priceList, 'page_size': size, 'products': products}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_MOBILE,
        payload
    }
}

export const orderChangePriceListAction = (orderId, priceList, size, products, currency) => {
    const params = serializers.priceListFilterSerializer(orderId, priceList, size, products, currency)
    const payload = axios()
        .get(API.PRODUCT_MOBILE_URL, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_CHANGE_PRICE,
        payload
    }
}

export const orderChangeCurrencyListAction = (orderId, priceList, size, products, currency) => {
    const params = serializers.priceListFilterSerializer(orderId, priceList, size, products, currency)
    const payload = axios()
        .get(API.PRODUCT_MOBILE_URL, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_CHANGE_PRICE,
        payload
    }
}

export const orderGetCounts = () => {
    const payload = axios()
        .get(API.ORDER_COUNTS)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_COUNTS,
        payload
    }
}

export const orderMultiUpdateAction = (data, orders, release) => {
    const requestData = serializers.multiUpdateSerializer(data, orders, release)
    const payload = axios()
        .post(API.ORDER_MULTI_UPDATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_MULTI_UPDATE,
        payload
    }
}

export const orderAddProductsListAction = (priceList, filter, productType, currency) => {
    const params = priceList === MINUS_ONE
        ? {
            'with_net_cost': ONE,
            currency: currency,
            page_size: _.get(filter.getParams(), 'pdPageSize'),
            page: _.get(filter.getParams(), 'pdPage'),
            search: _.get(filter.getParams(), 'pdSearch'),
            type: productType
        }
        : {
            price_list: priceList,
            currency: currency,
            page_size: _.get(filter.getParams(), 'pdPageSize'),
            page: _.get(filter.getParams(), 'pdPage'),
            search: _.get(filter.getParams(), 'pdSearch'),
            type: productType
        }
    const payload = axios()
        .get(API.PRODUCT_MOBILE_URL, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRODUCT_MOBILE,
        payload
    }
}
