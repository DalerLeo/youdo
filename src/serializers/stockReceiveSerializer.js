import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const ZERO = 0
export const acceptSerializer = (id, stock) => {
    return {
        'order': id,
        stock
    }
}

export const createSerializer = (data, detail) => {
    const provider = _.get(detail, ['provider', 'id'])
    const products = _.map(_.get(detail, 'products'), (item, index) => {
        const supplyProduct = _.get(item, 'id')
        return {
            'amount': numberWithoutSpaces(_.get(data, ['product', index, 'accepted'])),
            'defect_amount': _.get(data, ['product', index, 'defected']),
            'supply_product': supplyProduct
        }
    })

    const stock = _.get(detail, ['stock', 'id'])
    const dateDelivery = _.get(detail, 'dateDelivery')
    const contact = _.get(detail, ['contact', 'id'])
    const currency = _.get(detail, ['currency', 'id'])

    return {
        provider,
        products,
        stock,
        'date_delivery': dateDelivery,
        contact,
        currency
    }
}

export const updateSerializer = (data, detail) => {
    return _.map(_.get(detail, 'products'), (item, index) => {
        const supplyProduct = _.get(item, 'id')

        return {
            'amount': _.get(data, ['product', index, 'accepted']),
            'defect_amount': _.get(data, ['product', index, 'defected']),
            'supply_product': supplyProduct,
            comment: '1'
        }
    })
}
export const listFilterSerializer = (data, history, outHistory) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const productType = _.get(data, 'typeChild') || _.get(data, 'typeParent')
    if (history) {
        return {
            'page': _.get(defaultData, 'page'),
            'page_size': _.get(defaultData, 'pageSize'),
            'search': _.get(defaultData, 'search'),
            'content_type': outHistory ? _.get(defaultData, 'type') : null,
            'accepted_by': _.get(defaultData, 'acceptedBy'),
            'stock': _.get(defaultData, 'stock'),
            'type': outHistory ? _.get(defaultData, 'status') : _.get(defaultData, 'type'),
            'product': _.get(defaultData, 'product'),
            'product_type': productType,
            'accepted_time_0': _.get(defaultData, 'fromDate'),
            'accepted_time_1': _.get(defaultData, 'toDate'),
            'ordering': ordering && orderingSnakeCase(ordering),
            history

        }
    }
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'search': _.get(defaultData, 'search'),
        'content_type': outHistory ? _.get(defaultData, 'type') : null,
        'stock': _.get(defaultData, 'stock'),
        'type': outHistory ? _.get(defaultData, 'status') : _.get(defaultData, 'type'),
        'product': _.get(defaultData, 'product'),
        'product_type': productType,
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate'),
        'ordering': ordering && orderingSnakeCase(ordering),
        history
    }
}

export const deliveryItemSerializer = (dateRange, detailId) => {
    return {
        'begin_date': _.get(dateRange, 'fromDate'),
        'end_date': _.get(dateRange, 'toDate'),
        'delivery_man': detailId > ZERO ? detailId : null
    }
}
export const deliveryItemDetailsSerializer = (dateRange, detailId, stockId) => {
    return {
        'begin_date': _.get(dateRange, 'fromDate'),
        'end_date': _.get(dateRange, 'toDate'),
        'delivery_man': detailId > ZERO ? detailId : null,
        'stock': stockId
    }
}

export const deliveryTransferSerializer = (details, stock, dateRange) => {
    const orders = _.get(details, 'orders')
    const deliveryMan = _.get(details, ['deliveryMan', 'id'])
    return {
        orders,
        'delivery_man': deliveryMan,
        stock,
        'begin_date': _.get(dateRange, 'beginDate'),
        'end_date': _.get(dateRange, 'endDate')
    }
}

