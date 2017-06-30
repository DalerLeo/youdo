import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data, productId) => {
    const prices = _.get(data, 'prices')

    return {
        'product': productId,
        'prices': prices
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
