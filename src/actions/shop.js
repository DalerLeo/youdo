import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/shopSerializer'

export const shopCreateAction = (formValues, location) => {
    const requestData = serializers.createSerializer(formValues, location)
    const payload = axios()
        .post(API.SHOP_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_CREATE,
        payload
    }
}

export const imageCreateAction = (image, id) => {
    const requestData = serializers.imageSerializer(image, id)
    const payload = axios()
        .post(sprintf(API.SHOP_ITEM_ADD_IMAGE, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_ITEM_ADD_IMAGE,
        payload
    }
}

export const imageDeleteAction = (shopId, imgId) => {
    const payload = axios()
        .delete(sprintf(API.SHOP_ITEM_DELETE_IMAGE, shopId, imgId))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_ITEM_DELETE_IMAGE,
        payload
    }
}

export const setPrimaryImageAction = (shopId, image) => {
    const payload = axios()
        .post(sprintf(API.SHOP_SET_PRIMARY_IMAGE, shopId), {image})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_SET_PRIMARY_IMAGE,
        payload
    }
}

export const shopDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.SHOP_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_DELETE,
        payload
    }
}

export const shopUpdateAction = (id, formValues, location) => {
    const requestData = serializers.createSerializer(formValues, location)
    const payload = axios()
        .put(sprintf(API.SHOP_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_UPDATE,
        payload
    }
}

export const shopListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.SHOP_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_LIST,
        payload
    }
}

export const shopItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.SHOP_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_ITEM,
        payload
    }
}

export const slideShowFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.SHOP_ITEM_SHOW_IMAGE, id), {params: {'thumbnail_type': 'large'}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.SHOP_ITEM_SHOW_IMAGE,
        payload
    }
}
