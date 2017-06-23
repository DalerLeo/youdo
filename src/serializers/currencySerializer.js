import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, 'name')
    const rate = _.get(data, 'rate')

    return {
        name,
        rate
    }
}

export const createPrimarySerializer = (data) => {
    const currency = _.get(data, ['currency', 'value'])

    return {
        currency
    }
}

export const itemSerializer = (data, id) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'currency': id,
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const setCurrencySerializer = (data, currency) => {
    const rate = _.get(data, 'rate')

    return {
        rate,
        currency
    }
}

export const historyListSerializer = (id) => {
    const currency = id

    return {
        'currency': currency
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'name': _.get(defaultData, 'name'),
        'page': 1,
        'page_size': 300,
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
