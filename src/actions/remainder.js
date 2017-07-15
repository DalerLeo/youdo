import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/remainderSerializer'

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

export const remainderItemFetchAction = (id, filter) => {
    const params = serializers.listFilterSerializer(filter.getParams(), id)
    const payload = axios()
        .get(sprintf(API.REMAINDER_ITEM, id), {params})
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

export const remainderTransferAction = (formValues) => {
    const requestData = serializers.transferSerializer(formValues)

    const payload = axios()
        .post(API.REMAINDER_TRANSFER_ITEM, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.REMAINDER_TRANSFER_ITEM,
        payload
    }
}
