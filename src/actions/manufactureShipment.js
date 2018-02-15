import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/shipmentSerializer'

export const shipmentListFetchAction = (filter, manufacture, dateRange) => {
    const params = serializers.listFilterSerializer(filter.getParams(), manufacture, dateRange)
    const payload = axios()
        .get(API.SHIPMENT_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_LIST,
        payload
    }
}

export const shipmentItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.SHIPMENT_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_ITEM,
        payload
    }
}

export const shipmentLogsListFetchAction = (filter, manufacture, dateRange) => {
    const params = serializers.logsFilterSerializer(filter.getParams(), manufacture, dateRange)
    const payload = axios()
        .get(API.SHIPMENT_LOGS, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_LOGS,
        payload
    }
}

export const shipmentProductsListFetchAction = (dateRange, shift, manufactureId) => {
    const beginDate = _.get(dateRange, 'beginDate')
    const endDate = _.get(dateRange, 'endDate')
    const payload = axios()
        .get(API.SHIPMENT_PRODUCTS_LIST, {params: {
            manufacture: manufactureId,
            shift: shift,
            begin_date: beginDate,
            end_date: endDate
        }})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_PRODUCTS_LIST,
        payload
    }
}

export const shipmentMaterialsListFetchAction = (dateRange, shift, manufactureId) => {
    const beginDate = _.get(dateRange, 'beginDate')
    const endDate = _.get(dateRange, 'endDate')
    const payload = axios()
        .get(API.SHIPMENT_MATERIALS_LIST, {params: {
            manufacture: manufactureId,
            shift: shift,
            begin_date: beginDate,
            end_date: endDate
        }})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_MATERIALS_LIST,
        payload
    }
}

export const addProductsListAction = (filter, productType, manufacture) => {
    const params = {
        page_size: _.get(filter.getParams(), 'pdPageSize'),
        page: _.get(filter.getParams(), 'pdPage'),
        search: _.get(filter.getParams(), 'pdSearch'),
        type: productType,
        manufacture
    }
    const payload = axios()
        .get(API.SHIPMENT_ADD_PRODUCTS_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_ADD_PRODUCTS_LIST,
        payload
    }
}

export const addRawsListAction = (filter, productType, stock, manufacture) => {
    const params = {
        page_size: _.get(filter.getParams(), 'pdPageSize'),
        page: _.get(filter.getParams(), 'pdPage'),
        search: _.get(filter.getParams(), 'pdSearch'),
        type: productType,
        manufacture_ingredient: manufacture,
        stock
    }
    const payload = axios()
        .get(API.SHIPMENT_ADD_RAW_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_ADD_RAW_LIST,
        payload
    }
}

export const addProductsSubmitAction = (data) => {
    const requestData = serializers.productsMaterialsCreate(data)
    const payload = axios()
        .post(API.SHIPMENT_ADD_PRODUCTS_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_ADD_PRODUCTS_CREATE,
        payload
    }
}

export const addRawsSubmitAction = (data) => {
    const requestData = serializers.productsMaterialsCreate(data)
    const payload = axios()
        .post(API.SHIPMENT_ADD_RAW_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_ADD_PRODUCTS_CREATE,
        payload
    }
}

export const editReturnAmountAction = (id, amount) => {
    const payload = axios()
        .put(sprintf(API.SHIPMENT_EDIT_PRODUCT_AMOUNT, id), {amount})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_EDIT_AMOUNT,
        payload
    }
}

export const editWriteOffAmountAction = (id, amount) => {
    const payload = axios()
        .put(sprintf(API.SHIPMENT_EDIT_MATERIAL_AMOUNT, id), {amount})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_EDIT_AMOUNT,
        payload
    }
}

export const deleteReturnProductAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.SHIPMENT_DELETE_PRODUCT, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_EDIT_AMOUNT,
        payload
    }
}

export const deleteWriteOffProductAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.SHIPMENT_DELETE_MATERIAL, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_DELETE,
        payload
    }
}

export const sendPersonalRotation = (id) => {
    const payload = axios()
        .post(API.SHIPMENT_SEND_TO_STOCK, {personal_rotation: id})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.SHIPMENT_SEND_TO_STOCK,
        payload
    }
}
