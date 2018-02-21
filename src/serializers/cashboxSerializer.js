import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
const HUNDRED = 100
export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const currency = _.get(data, ['currency', 'value'])
    const cashier = _.get(data, ['cashier', 'value'])
    const type = _.get(data, ['type', 'value'])
    const division = _.get(data, ['division', 'value'])

    return {
        name,
        currency,
        cashier,
        division,
        type: type
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'name': _.get(defaultData, 'name'),
        'exclude': _.get(defaultData, 'exclude'),
        'cashier': _.get(defaultData, 'cashier'),
        'type': _.get(defaultData, 'type'),
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': HUNDRED,
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

