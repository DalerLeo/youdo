import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/incomeCategorySerializer'

export const incomeCategoryCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.INCOME_CATEGORY_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INCOME_CATEGORY_CREATE,
        payload
    }
}

export const incomeCategoryDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.INCOME_CATEGORY_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INCOME_CATEGORY_DELETE,
        payload
    }
}

export const incomeCategoryUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.INCOME_CATEGORY_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INCOME_CATEGORY_UPDATE,
        payload
    }
}

export const incomeCategoryListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.INCOME_CATEGORY_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INCOME_CATEGORY_LIST,
        payload
    }
}

export const incomeCategoryItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.INCOME_CATEGORY_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.INCOME_CATEGORY_ITEM,
        payload
    }
}

export const optionsListFetchAction = () => {
    const payload = axios()
        .get(API.OPTIONS_LIST, {params: {page_size: 100}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.OPTIONS_LIST,
        payload
    }
}
