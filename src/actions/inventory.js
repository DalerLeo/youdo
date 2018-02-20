import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/inventorySerializer'

export const inventoryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.REMAINDER_INVENTORY_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_INVENTORY_LIST,
        payload
    }
}

export const inventoryItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.REMAINDER_INVENTORY_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_INVENTORY_ITEM,
        payload
    }
}

export const inventoryProductsFetchAction = (filter, productType, page) => {
    const params = serializers.inventoryFilterSerializer(filter.getParams(), productType, page)
    const payload = axios()
        .get((API.REMAINDER_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_INVENTORY,
        payload
    }
}

export const inventoryCreateFetchAction = (formData, queryData) => {
    const requestData = serializers.inventoryCreateSerializer(formData, queryData)
    const payload = axios()
        .post((API.REMAINDER_INVENTORY_CREATE), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_INVENTORY_CREATE,
        payload
    }
}

export const inventoryVerifyAction = (formData, id) => {
    const manufacture = _.get(formData, ['manufacture', 'value'])
    const payload = axios()
        .post(sprintf(API.REMAINDER_INVENTORY_VERIFY, id), {manufacture})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_INVENTORY_VERIFY,
        payload
    }
}

