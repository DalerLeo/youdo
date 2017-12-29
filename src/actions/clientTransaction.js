import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/clientTransactionSerializer'

export const clientTransactionDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.CLIENT_TRANSACTION_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_DELETE,
        payload
    }
}

export const clientTransactionResendAction = (id) => {
    const payload = axios()
        .post(API.CLIENT_TRANSACTION_RESEND, {client_transaction: id})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_RESEND,
        payload
    }
}

export const clientTransactionListFetchAction = (filter, clientId) => {
    const params = serializers.listFilterSerializer(filter.getParams(), clientId)
    const payload = axios()
        .get(API.CLIENT_TRANSACTION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_TRANSACTION_LIST,
        payload
    }
}

