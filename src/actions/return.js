import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/returnSerializer'

export const returnDeleteAction = (id) => {
    const payload = axios()
        .post(sprintf(API.RETURN_CANCEL, id), {})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_CANCEL,
        payload
    }
}

export const returnListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.RETURN_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_LIST,
        payload
    }
}

export const returnListPintFetchAction = (id) => {
    const payload = axios()
        .get(API.RETURN_PRINT, {'params': {'id': id}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_PRINT,
        payload
    }
}

export const returnItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.RETURN_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_ITEM,
        payload
    }
}

export const returnCancelAction = (id) => {
    const payload = axios()
        .post(sprintf(API.RETURN_CANCEL, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.RETURN_CANCEL,
        payload
    }
}
