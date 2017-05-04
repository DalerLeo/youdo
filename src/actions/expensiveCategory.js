import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/expensiveCategorySerializer'

export const expensiveCategoryCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.EXPENSIVE_CATEGORY_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.EXPENSIVE_CATEGORY_CREATE,
        payload
    }
}

export const expensiveCategoryDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.EXPENSIVE_CATEGORY_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.EXPENSIVE_CATEGORY_DELETE,
        payload
    }
}

export const expensiveCategoryUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.EXPENSIVE_CATEGORY_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.EXPENSIVE_CATEGORY_UPDATE,
        payload
    }
}

export const expensiveCategoryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.EXPENSIVE_CATEGORY_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.EXPENSIVE_CATEGORY_LIST,
        payload
    }
}

export const expensiveCategoryCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.EXPENSIVE_CATEGORY_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.EXPENSIVE_CATEGORY_LIST_CSV,
        payload
    }
}

export const expensiveCategoryItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.EXPENSIVE_CATEGORY_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.EXPENSIVE_CATEGORY_ITEM,
        payload
    }
}
