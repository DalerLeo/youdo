import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data, expenseId) => {
    const cashboxId = _.get(data, ['cashbox', 'value'])
    const categoryId = _.get(data, ['categoryId', 'value'])
    return {
        'cashbox': cashboxId,
        'expanse': expenseId,
        'expanse_category': categoryId
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const itemFilterSerializer = (data, id, type) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    return {
        'client': id,
        'payment_type': type,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

const ZERO = 0
const MINUS_ONE = -1

export const createExpenseSerializer = (data, client) => {
    const amount = numberWithoutSpaces(_.get(data, 'amount'))
    const newAmount = amount > ZERO ? amount * MINUS_ONE : amount
    const comment = _.get(data, 'comment')
    const currency = _.get(data, ['currency', 'value'])
    const category = _.get(data, ['category', 'value'])

    return {
        'amount': newAmount,
        'comment': comment,
        'client': client,
        'currency': currency,
        'category': category
    }
}