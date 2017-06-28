import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Shop/shopSerializer'
import * as imageSerializers from '../serializers/Shop/shopImageSerializer'

export const shopCreateAction = (formValues, location, image) => {
    const requestData = serializers.createSerializer(formValues, location, image)
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
    const requestData = imageSerializers.createSerializer(image, id)
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

export const shopUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
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

export const shopCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.SHOP_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHOP_LIST_CSV,
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
