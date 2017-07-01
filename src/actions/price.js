import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/priceSerializer'

export const priceCreateAction = (formValues, productId) => {
    const requestData = serializers.createSerializer(formValues, productId)
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
