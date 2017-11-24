import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'
import getConfig from '../helpers/getConfig'

const ZERO = 0
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
        'balance_type': _.get(defaultData, 'balanceType'),
        'payment_type': _.get(defaultData, 'paymentType'),
        'division': _.get(defaultData, 'divisionFilter'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const sumFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate')
    }
}
export const itemFilterSerializer = (data, id, division, type) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const paymentType = type || null
    if (division > ZERO) {
        return {
            'client': id,
            'division': division,
            'payment_type': paymentType,
            'page': _.get(defaultData, 'dPage'),
            'page_size': _.get(defaultData, 'dPageSize'),
            'ordering': ordering && orderingSnakeCase(ordering)
        }
    }
    return {
        'client': id,
        'payment_type': paymentType,
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

const MINUS_ONE = -1

export const createExpenseSerializer = (data, client) => {
    const amount = numberWithoutSpaces(_.get(data, 'amount'))
    const newAmount = amount > ZERO ? amount * MINUS_ONE : amount
    const comment = _.get(data, 'comment')
    const currency = getConfig('PRIMARY_CURRENCY_ID')
    const division = _.get(data, ['division', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])

    return {
        'amount': newAmount,
        'comment': comment,
        client,
        currency,
        division,
        type: 9,
        payment_type: paymentType
    }
}
export const createAddSerializer = (data, client) => {
    const amount = numberWithoutSpaces(_.get(data, 'amount'))
    const newAmount = amount > ZERO ? amount : amount * MINUS_ONE
    const comment = _.get(data, 'comment')
    const currency = getConfig('PRIMARY_CURRENCY_ID')
    const division = _.get(data, ['division', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])

    return {
        'amount': newAmount,
        'comment': comment,
        client,
        currency,
        division,
        type: 9,
        payment_type: paymentType
    }
}

export const updateTransactionSerializer = (data, client) => {
    const newAmount = _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const customRate = _.get(data, 'custom_rate')
    const currency = _.get(data, ['currency', 'value'])
    const division = _.get(data, ['division', 'value'])
    const user = _.get(data, ['user', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])

    return {
        'amount': newAmount,
        'comment': comment,
        client,
        currency,
        'custom_rate': customRate || null,
        division,
        user,
        type: 9,
        payment_type: paymentType
    }
}
