import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

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
            'amount': _.get(data, ['product', index, 'accepted']),
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

export const listFilterSerializer = (data, history) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'search': _.get(defaultData, 'search'),
        'type': _.get(defaultData, 'type'),
        'stock': _.get(defaultData, 'stock'),
        'from_date': _.get(defaultData, 'fromDate'),
        'to_date': _.get(defaultData, 'toDate'),
        'ordering': ordering && orderingSnakeCase(ordering),
        history

    }
}

