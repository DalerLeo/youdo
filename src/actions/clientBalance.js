import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/clientBalanceSerializer'

export const clientBalanceUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues, id)
    const payload = axios()
        .post(API.CLIENT_BALANCE_UPDATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_BALANCE_UPDATE,
        payload
    }
}

export const clientBalanceListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.CLIENT_BALANCE_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_BALANCE_LIST,
        payload
    }
}

export const clientBalanceItemFetchAction = (filter, id) => {
    const params = serializers.itemFilterSerializer(filter.getParams(), id)
    const payload = axios()
        .get(API.CLIENT_BALANCE_ITEM, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_BALANCE_ITEM,
        payload
    }
}
