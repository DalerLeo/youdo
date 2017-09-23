import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/stockReceiveSerializer'

export const stockReceiveCreateAction = (formValues, supplyId, detail) => {
    const requestData = serializers.createSerializer(formValues, detail)
    const payload = axios()
        .post(sprintf(API.STOCK_RECEIVE_CREATE, supplyId), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_CREATE,
        payload
    }
}

export const stockReceiveUpdateAction = (formValues, supplyId, detail) => {
    const requestData = serializers.updateSerializer(formValues, detail)
    const payload = axios()
        .post(sprintf(API.STOCK_RECEIVE_UPDATE, supplyId), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_UPDATE,
        payload
    }
}

export const stockReceiveListFetchAction = (filter, history) => {
    const params = serializers.listFilterSerializer(filter.getParams(), history)
    const payload = axios()
        .get((API.STOCK_RECEIVE_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_LIST,
        payload
    }
}

export const stockReceiveItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STOCK_RECEIVE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_ITEM,
        payload
    }
}

export const stockHistoryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STOCK_HISTORY_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_HISTORY_LIST,
        payload
    }
}

export const stockReceiveOrderItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STOCK_RECEIVE_ORDER_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_ORDER_ITEM,
        payload
    }
}

export const stockTransferListFetchAction = (filter, history) => {
    const params = serializers.listFilterSerializer(filter.getParams(), history)
    const payload = axios()
        .get((API.STOCK_TRANSFER_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_TRANSFER_LIST,
        payload
    }
}
export const stockTransferItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STOCK_TRANSFER_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_TRANSFER_ITEM,
        payload
    }
}

//
// export const stockTransferItemFetchAction = (id) => {
//     const payload = axios()
//         .get(sprintf(API.STOCK_TRANSFER_ITEM, id))
//         .then((response) => {
//             return _.get(response, 'data')
//         })
//         .catch((error) => {
//             return Promise.reject(_.get(error, ['response', 'data']))
//         })
//
//     return {
//         type: actionTypes.STOCK_TRANSFER_ITEM,
//         payload
//     }
// }

export const stockTransferItemAcceptAction = (id, stock) => {
    const requestData = serializers.acceptSerializer(id, stock)
    const payload = axios()
        .post(API.STOCK_TRANSFER_ACCEPT, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_TRANSFER_ACCEPT,
        payload
    }
}

export const stockReceiveItemConfirmAction = (id, status) => {
    const payload = axios()
        .post(sprintf(API.STOCK_RECEIVE_TRANSFER_CHANGE_STATUS, id), {status: status})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_TRANSFER_CHANGE_STATUS,
        payload
    }
}

export const stockReceiveDeliveryConfirmAction = (id, status) => {
    const payload = axios()
        .post(API.STOCK_RECEIVE_DELIVERY_RETURN, {delivery_return: id, status: status})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_DELIVERY_RETURN,
        payload
    }
}

export const stockReceiveItemReturnAction = (id) => {
    const payload = axios()
        .post(API.STOCK_RECEIVE_ACCEPT_ORDER_RETURN, {order_return: id})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STOCK_RECEIVE_ACCEPT_ORDER_RETURN,
        payload
    }
}
export const historyOrderItemFetchAction = (id) => {
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

