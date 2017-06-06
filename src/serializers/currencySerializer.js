import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

export const createPrimarySerializer = (data) => {
    const currency = _.get(data, ['currency', 'value'])

    return {
        currency
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
