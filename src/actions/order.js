import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/orderSerializer'
import * as returnSerializers from '../serializers/orderReturnSerializer'

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

export const orderListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
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
    const params = serializers.listFilterSerializer(filter.getParams(), id)
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

export const orderTransactionFetchAction = (orderId) => {
    let params = ''

    if (orderId === 'trans') {
        params = {
            transaction: 0
        }
    } else {
        params = {
            'order': orderId
        }
    }

    const payload = axios()
        .get(sprintf(API.ORDER_PAYMENTS, orderId), {params})
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
        .get(sprintf(API.ORDER_ITEM, id), {'params': {'view': true}})
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

