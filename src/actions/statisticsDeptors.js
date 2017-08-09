import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Statistics/statDebtorsSerializer'
import fileDownload from 'react-file-download'

export const statDebtorsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get((API.STAT_DEBTORS_LIST), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_LIST,
        payload
    }
}

export const statDebtorsDataFetchAction = () => {
    const payload = axios()
        .get(API.STAT_DEBTORS_DATA)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_DATA,
        payload
    }
}

export const statDebtorsItemFetchAction = (id) => {
    const params = serializers.itemSerializer(id)
    const payload = axios()
        .get(sprintf(API.STAT_DEBTORS_ITEM, id), {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_ITEM,
        payload
    }
}

export const statDebtorsOrderItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.ORDER_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_ITEM,
        payload
    }
}
export const getDocumentAction = () => {
    const payload = axios()
        .get(sprintf(API.STAT_DEBTORS_GET_DOCUMENT))
        .then((response) => {
            fileDownload(response.data, 'договор.xls')
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STAT_DEBTORS_GET_DOCUMENT,
        payload
    }
}
