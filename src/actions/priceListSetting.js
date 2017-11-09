import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/priceListSettingSerializer'

export const priceListSettingCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.PRICE_LIST_SETTING_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRICE_LIST_SETTING_CREATE,
        payload
    }
}

export const priceListSettingDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.PRICE_LIST_SETTING_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PRICE_LIST_SETTING_DELETE,
        payload
    }
}

export const priceListSettingUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.PRICE_LIST_SETTING_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRICE_LIST_SETTING_UPDATE,
        payload
    }
}

export const priceListSettingListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.PRICE_LIST_SETTING_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRICE_LIST_SETTING_LIST,
        payload
    }
}

export const priceListSettingGetAllAction = () => {
    const params = {
        'page': 1,
        'page_size': 100
    }
    const payload = axios()
        .get(API.PRICE_LIST_SETTING_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRICE_LIST_SETTING_LIST,
        payload
    }
}

export const priceListSettingItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PRICE_LIST_SETTING_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PRICE_LIST_SETTING_ITEM,
        payload
    }
}