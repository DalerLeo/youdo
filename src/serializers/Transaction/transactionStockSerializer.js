import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

const ZERO = 0
export const listFilterSerializer = (data, stock) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return (stock !== ZERO) ? {
        'brand': _.get(defaultData, 'brand'),
        'type': _.get(defaultData, 'type'),
        'stock': stock,
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'search': _.get(defaultData, 'search'),
        'ordering': ordering && orderingSnakeCase(ordering)
    } : {
        'brand': _.get(defaultData, 'brand'),
        'type': _.get(defaultData, 'type'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

