import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/statDebtorsSerializer'

export const statDebtorsCreateAction = (formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .post(API.STATDEBTORS_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_CREATE,
        payload
    }
}

export const statDebtorsDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.STATDEBTORS_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_DELETE,
        payload
    }
}

export const statDebtorsUpdateAction = (id, formValues) => {
    const requestData = serializers.createSerializer(formValues)
    const payload = axios()
        .put(sprintf(API.STATDEBTORS_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_UPDATE,
        payload
    }
}

export const statDebtorsListFetchAction = (filter) => {
    const params = serializers.listFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STATDEBTORS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_LIST,
        payload
    }
}

export const statDebtorsOrderListFetchAction = (id) => {
    const params = serializers.orderListFilterSerializer(id)
    const payload = axios()
        .get(API.STATDEBTORS_ORDER_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_ORDER_LIST,
        payload

    }
}
export const statDebtorsSumFetchAction = () => {
    const payload = axios()
        .get(API.STATDEBTORS_SUM)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_SUM,
        payload
    }
}

export const statDebtorsCSVFetchAction = (filter) => {
    const params = serializers.csvFilterSerializer(filter.getParams())
    const payload = axios()
        .get(API.STATDEBTORS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_LIST_CSV,
        payload
    }
}

export const statDebtorsItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.STATDEBTORS_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.STATDEBTORS_ITEM,
        payload
    }
}
