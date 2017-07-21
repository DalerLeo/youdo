import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import moment from 'moment'

export const listFilterSerializer = (data, remaider) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'type': _.get(defaultData, 'type'),
        'stock': _.get(defaultData, 'stock'),
        'status': _.get(defaultData, 'status'),
        'searching': _.get(defaultData, 'product')
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

