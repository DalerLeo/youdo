import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/remainderSerializer'

export const remainderCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.REMAINDER_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_CREATE,
        payload
    }
}

export const remainderDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.REMAINDER_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_DELETE,
        payload
    }
}

export const remainderUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.REMAINDER_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_UPDATE,
        payload
    }
}

export const remainderListFetchAction = (filter, id) => {
    const params = serializers.listFilterSerializer(filter.getParams(), id)
    const payload = axios()
        .get((API.REMAINDER_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_LIST,
        payload
    }
}

export const remainderCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.REMAINDER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_LIST_CSV,
        payload
    }
}

export const remainderItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.REMAINDER_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_ITEM,
        payload
    }
}
