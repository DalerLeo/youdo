import _ from 'lodash'
import axios from '../helpers/axios'
import sprintf from 'sprintf'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/planSerializer'

export const planCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.PLAN_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PLAN_CREATE,
        payload
    }
}

export const planListFetchAction = () => {
    const payload = axios()
        .get(API.PLAN_LIST)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PLAN_LIST,
        payload
    }
}

export const planItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.PLAN_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PLAN_ITEM,
        payload
    }
}

export const planListSearchFetchAction = (search) => {
    const payload = axios()
        .get(API.PLAN_LIST, {params: {'search': search}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })
    return {
        type: actionTypes.PLAN_LIST,
        payload
    }
}
