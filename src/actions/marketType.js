import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/marketTypeSerializer'

export const marketTypeCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.MARKET_TYPE_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MARKET_TYPE_CREATE,
        payload
    }
}

export const marketTypeDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.MARKET_TYPE_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.MARKET_TYPE_DELETE,
        payload
    }
}

export const marketTypeUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.MARKET_TYPE_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MARKET_TYPE_UPDATE,
        payload
    }
}

export const marketTypeListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.MARKET_TYPE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MARKET_TYPE_LIST,
        payload
    }
}

export const marketTypeGetAllAction = () => {
    const params = {
        'page': 1,
        'page_size': 100
    }
    const payload = axios()
        .get(API.MARKET_TYPE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MARKET_TYPE_LIST,
        payload
    }
}

export const marketTypeItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.MARKET_TYPE_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.MARKET_TYPE_ITEM,
        payload
    }
}
