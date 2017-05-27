import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/userShiftSerializer'

export const userShiftCreateAction = (formValues, manufacture) => {
    const requestData = serializers.createSerializer(formValues, manufacture)
    const payload = axios()
        .post(API.USER_SHIFT_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USER_SHIFT_CREATE,
        payload
    }
}

export const userShiftDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.USER_SHIFT_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USER_SHIFT_DELETE,
        payload
    }
}

export const userShiftUpdateAction = (id, formValues, manufacture) => {
    const requestData = serializers.createSerializer(formValues, manufacture)
    const payload = axios()
        .put(sprintf(API.USER_SHIFT_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USER_SHIFT_UPDATE,
        payload
    }
}

export const userShiftListFetchAction = (data, manufactureId) => {
    const params = serializers.listFilterSerializer(data, manufactureId)
    const payload = axios()
        .get(API.USER_SHIFT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USER_SHIFT_LIST,
        payload
    }
}

export const userShiftCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.USER_SHIFT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USER_SHIFT_LIST_CSV,
        payload
    }
}

export const userShiftItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.USER_SHIFT_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USER_SHIFT_ITEM,
        payload
    }
}

export const addProductAction = (formValues) => {
    const requestData = serializers.addProductSerializer(formValues)
    const payload = axios()
        .post(API.USER_SHIFT_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USER_SHIFT_CREATE,
        payload
    }
}
