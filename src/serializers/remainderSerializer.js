import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'

const ZERO = 0

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const type = _.get(defaultData, 'typeChild') || _.get(defaultData, 'typeParent')

    const ordering = _.get(data, 'ordering')
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        type,
        'brand': _.get(defaultData, 'brand'),
        'stock': _.get(defaultData, 'stock'),
        'measurement': _.get(defaultData, 'measurement'),
        'search': _.get(defaultData, 'search'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const itemFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize')
    }
}
export const transferSerializer = (data) => {
    const fromStock = _.get(data, ['fromStock', 'value'])
    const toStock = _.get(data, ['toStock', 'value'])
    const comment = _.get(data, ['comment'])
    const deliveryDate = _.get(data, 'dateDelivery') ? moment(_.get(data, 'dateDelivery')).format('YYYY-MM-DD') : null
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            amount: item.amount || ZERO,
            product: item.product.value.id,
            defect: item.defect || ZERO
        }
    })

    return {
        'from_stock': fromStock,
        'to_stock': toStock,
        'date_delivery': deliveryDate,
        products,
        comment
    }
}

export const discardSerializer = (data) => {
    const comment = _.get(data, ['comment'])
    const stock = _.get(data, ['stock', 'value'])
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            amount: item.amount || ZERO,
            product: item.product.value.id,
            defect: item.defect || ZERO
        }
    })

    return {
        products,
        comment,
        stock
    }
}

export const inventoryFilterSerializer = (data, productType, page) => {
    const {...defaultData} = data
    return {
        'page': page,
        'page_size': 50,
        'product_type': productType,
        'stock': _.get(defaultData, 'pdStock'),
        'search': _.get(defaultData, 'pdSearch')
    }
}

export const inventoryCreateSerializer = (form, query) => {
    return {
        stock: _.get(query, ['pdStock']),
        inventory_products: _.map(form, (item) => {
            return {
                product: _.get(item, 'id'),
                amount: _.get(item, 'amount'),
                defect_amount: _.get(item, 'defect')
            }
        })
    }
}
