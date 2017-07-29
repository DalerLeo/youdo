import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'
const ONE = 1
const ZERO = 0
const TWO = 2

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const status = (_.toInteger(_.get(defaultData, 'status')) === _.toInteger(ONE)) ? ZERO
        : (_.toInteger(_.get(defaultData, 'status')) === _.toInteger(TWO)) ? ONE
            : null
    const ordering = _.get(data, 'ordering')
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'type': _.get(defaultData, 'type'),
        'stock': _.get(defaultData, 'stock'),
        'status': status,
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
export const transferSerializer = (data) => {
    const fromStock = _.get(data, ['fromStock', 'value'])
    const toStock = _.get(data, ['toStock', 'value'])
    const comment = _.get(data, ['comment'])
    const deliveryDate = moment(_.get(data, 'deliveryDate')).format('YYYY-MM-DD')
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            amount: item.amount,
            product: item.product.value.id
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
    const products = _.map(_.get(data, 'products'), (item) => {
        return {
            amount: item.amount,
            product: item.product.value.id
        }
    })

    return {
        products,
        comment
    }
}

