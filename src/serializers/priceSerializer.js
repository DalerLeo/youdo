import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data, productId) => {
    const prices = _.get(data, 'prices')
    const newPrices = _.map(prices, (val) => {
        return {
            'cash_price': numberWithoutSpaces(_.get(val, 'cash_price')),
            'market_type': _.get(val, 'market_type'),
            'transfer_price': numberWithoutSpaces(_.get(val, 'transfer_price')),
            'currency': _.get(val, ['currency', 'value'])
        }
    })
    return {
        'product': productId,
        'prices': newPrices
    }
}

export const listFilterSerializer = (data, manufacture) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'manufacture': manufacture,
        'brand': _.get(defaultData, 'brand'),
        'type': _.get(defaultData, 'type'),
        'measurement': _.get(defaultData, 'measurement'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}