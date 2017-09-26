import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'

const ZERO = 0
const MINUS_ONE = -1

export const createIncomeSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const clientId = _.get(data, ['client', 'value'])
    const customRate = numberWithoutSpaces(_.get(data, 'custom_rate'))
    const division = _.get(data, ['division', 'value'])
    return {
        'amount': numberWithoutSpaces(amount),
        comment,
        'cashbox': cashboxId,
        'client': clientId,
        'custom_rate': customRate,
        'division': division && division
    }
}
const TWO = 2

export const updateTransactionSerializer = (data, client) => {
    const amount = numberWithoutSpaces(_.get(data, 'amount'))
    const newAmount = amount > ZERO ? amount : amount * MINUS_ONE
    const comment = _.get(data, 'comment')
    const customRate = _.get(data, 'custom_rate')
    const currency = _.get(data, ['currency', 'value'])
    const division = _.get(data, ['division', 'value'])
    const user = _.get(data, ['user', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    return {
        'amount': newAmount,
        'comment': comment,
        'custom_rate': customRate,
        client,
        currency,
        division,
        user,
        type: 1,
        payment_type: paymentType === TWO ? ZERO : paymentType
    }
}

export const createExpenseSerializer = (data, cashboxId) => {
    let amount = numberWithoutSpaces(_.get(data, 'amount'))
    if (amount > ZERO) {
        amount *= MINUS_ONE
    }
    const comment = _.get(data, 'comment')
    const showClients = _.get(data, 'showClients')
    const objectId = _.get(data, ['expanseCategory', 'value'])
    const clientId = _.get(data, ['client', 'value'])
    const customRate = numberWithoutSpaces(_.get(data, 'custom_rate'))
    const division = _.get(data, ['division', 'value'])
    if (showClients) {
        return {
            amount: amount,
            comment,
            'cashbox': cashboxId,
            'expanse_category': objectId,
            'client': clientId,
            'custom_rate': customRate,
            'division': division && division
        }
    }
    return {
        amount: amount,
        comment,
        'cashbox': cashboxId,
        'expanse_category': objectId,
        'custom_rate': customRate,
        'division': division && division
    }
}

export const createSendSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const toCashbox = _.get(data, ['categoryId', 'value'])
    const comment = _.get(data, 'comment')
    const customRate = _.get(data, 'custom_rate')
    if (customRate) {
        return {
            amount: numberWithoutSpaces(amount),
            'from_cashbox': cashboxId,
            'to_cashbox': toCashbox,
            'custom_rate': numberWithoutSpaces(customRate),
            comment
        }
    }
    return {
        amount: numberWithoutSpaces(amount),
        'from_cashbox': cashboxId,
        'to_cashbox': toCashbox,
        comment
    }
}

export const listFilterSerializer = (data, cashbox) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const newCashbox = (cashbox && cashbox > ZERO) ? cashbox : null
    const type = _.get(defaultData, 'type')
    return {
        'division': _.get(defaultData, 'division'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'type': type,
        'cashbox': newCashbox,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'client': _.get(defaultData, 'client'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'expanse_category': _.get(data, 'categoryExpense')
    }
}
