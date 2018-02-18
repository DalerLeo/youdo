import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const courseSerializer = (data, currency) => {
    const rate = _.get(data, 'rate')

    return {
        rate,
        currency
    }
}

export const createSerializer = (data) => {
    const name = _.get(data, 'name')
    const rate = _.get(data, 'rate')

    return {
        name,
        rate
    }
}

export const itemSerializer = (data, id) => {
    const {...defaultData} = data
    const ordering = '-id'
    return {
        'currency': id,
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'name': _.get(defaultData, 'name'),
        'search': _.get(defaultData, 'search'),
        'page': 1,
        'page_size': 300,
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

