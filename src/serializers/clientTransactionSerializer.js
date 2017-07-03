import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const MINUS_ONE = -1
const ZERO = 0
export const createIncomeSerializer = (data, client) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const currency = _.get(data, ['currency', 'value'])

    return {
        'amount': amount,
        'comment': comment,
        'client': client,
        'currency': currency
    }
}

export const createExpenseSerializer = (data, client) => {
    const amount = _.get(data, 'amount') > ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const currency = _.get(data, ['currency', 'value'])
    const category = _.get(data, ['category', 'value'])

    return {
        'amount': amount,
        'comment': comment,
        'client': client,
        'currency': currency,
        'category': category
    }
}

export const listFilterSerializer = (data, client) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'client': client,
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'expanse_category': _.get(data, 'categoryExpense')
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
