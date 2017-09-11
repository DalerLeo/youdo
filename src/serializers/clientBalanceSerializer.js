import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'
import getConfig from '../helpers/getConfig'

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
export const itemFilterSerializer = (data, id, division, type) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const CASH = 0
    const BANK = 1
    const paymentType = (type === 'cash') ? CASH : (type === 'bank') ? BANK : null
    return {
        'client': id,
        'division': division,
        'payment_type': paymentType,
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

const ZERO = 0
const MINUS_ONE = -1
const TWO = 2

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
        payment_type: paymentType === TWO ? ZERO : paymentType
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
        payment_type: paymentType === TWO ? ZERO : paymentType
    }
}

export const updateTransactionSerializer = (data, client) => {
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
        payment_type: paymentType === TWO ? ZERO : paymentType
    }
}

export const createReturnSerializer = (data, id) => {
    const client = id
    const stock = _.get(data, ['stock', 'value'])
    const division = _.get(data, ['division', 'value'])
    const comment = _.get(data, ['comment'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const products = _.map(_.get(data, ['products']), (item) => {
        const amount = numberWithoutSpaces(_.get(item, 'amount'))
        const cost = numberWithoutSpaces(_.get(item, 'cost'))
        const product = _.get(item, ['product', 'value', 'id'])
        return {
            amount,
            cost,
            product
        }
    })

    return {
        client,
        stock,
        comment,
        products,
        division,
        'payment_type': paymentType
    }
}
