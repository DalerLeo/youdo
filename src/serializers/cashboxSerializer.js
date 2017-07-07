import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const currency = _.get(data, ['currency', 'value'])
    const cashier = _.get(data, ['cashier', 'value'])
    const type = _.get(data, ['type', 'value'])

    return {
        name,
        currency,
        cashier,
        type
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'currency': _.get(defaultData, 'currency'),
        'name': _.get(defaultData, 'name'),
        'cashier': _.get(defaultData, 'cashier'),
        'type': _.get(defaultData, 'type'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
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
