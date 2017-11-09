import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Supply/supplySerializer'

export const supplyCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)

    const payload = axios()
        .post(API.SUPPLY_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_CREATE,
        payload
    }
}
export const supplyDefectAction = (supplyId, productId) => {
    const payload = axios()
        .get(sprintf(API.SUPPLY_DEFECT, supplyId, productId))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_DEFECT,
        payload
    }
}

export const supplyDeleteAction = (id) => {
    const payload = axios()
        .post(API.SUPPLY_CANCEL, {pk: id})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_CANCEL,
        payload
    }
}

export const supplyUpdateAction = (id, formValues) => {
    const requestData = serializers.updateSerializer(formValues, id)
    const payload = axios()
        .put(sprintf(API.SUPPLY_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_UPDATE,
        payload
    }
}

export const supplyListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.SUPPLY_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_LIST,
        payload
    }
}

export const supplyItemFetchAction = (id) => {
    const params = {'extended': 1}
    const payload = axios()
        .get(sprintf(API.SUPPLY_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SUPPLY_ITEM,
        payload
    }
}

