import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'
const ONE = 1

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
        'searching': _.get(defaultData, 'search'),
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

export const reservedItemFilterSerializer = (data, id) => {
    const {...defaultData} = data

    return {
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        product: id
    }
}
export const transferSerializer = (data) => {
    const fromStock = _.get(data, ['fromStock', 'value'])
    const toStock = _.get(data, ['toStock', 'value'])
    const comment = _.get(data, ['comment'])
    const deliveryDate = moment(_.get(data, 'deliveryDate')).format('YYYY-MM-DD')
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            amount: item.amount,
            product: item.product.value.id,
            'is_defect': _.get(item, ['isDefect', 'id']) === ONE
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
    const stock = _.get(data, ['fromStock', 'value'])
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            amount: item.amount,
            product: item.product.value.id,
            'is_defect': _.get(item, ['isDefect', 'id']) === ONE
        }
    })

    return {
        products,
        comment,
        stock
    }
}

