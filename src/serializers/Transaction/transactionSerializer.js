import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import getConfig from '../../helpers/getConfig'
import toBoolean from '../../helpers/toBoolean'
import moment from 'moment'

const ZERO = 0
const MINUS_ONE = -1

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
        payment_type: paymentType
    }
}

export const createIncomeSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const showClients = _.get(data, 'showClients')
    const clientId = _.get(data, ['client', 'value'])
    const customRate = numberWithoutSpaces(_.get(data, 'custom_rate'))
    const division = _.get(data, ['division', 'value'])
    const cashbox = _.get(data, ['cashbox', 'value'])
    const date = moment(_.get(data, 'date')).format('YYYY-MM-DD HH:00:00')
    return (showClients)
    ? {
        'amount': numberWithoutSpaces(amount),
        comment,
        'cashbox': _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
        'client': clientId,
        'custom_rate': customRate,
        'division': division,
        'date': date
    }
    : {
        'amount': numberWithoutSpaces(amount),
        comment,
        'cashbox': _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
        'custom_rate': customRate,
        'date': date
    }
}

export const createExpenseSerializer = (data, cashboxId) => {
    let amount = numberWithoutSpaces(_.get(data, 'amount'))
    if (amount > ZERO) {
        amount *= MINUS_ONE
    }
    const staffs = _.filter(_.map(_.get(data, 'users'), (item, index) => {
        return {
            staff: _.toInteger(index),
            amount: numberWithoutSpaces(_.get(item, 'amount'))
        }
    }), (item) => {
        return _.toNumber(_.get(item, 'amount')) > ZERO
    })
    const comment = _.get(data, 'comment')
    const expenseId = _.get(data, ['expanseCategory', 'value', 'id'])
    const clientId = _.get(data, ['client', 'value'])
    const customRate = numberWithoutSpaces(_.get(data, 'custom_rate'))
    const division = _.get(data, ['division', 'value'])
    const cashbox = _.get(data, ['cashbox', 'value'])
    const date = moment(_.get(data, 'date')).format('YYYY-MM-DD HH:00:00')
    return (clientId)
        ? {
            amount: amount,
            comment,
            'cashbox': _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
            'expanse_category': expenseId,
            'client': clientId,
            'custom_rate': customRate,
            'division': division,
            'date': date,
            staffs
        }
        : {
            amount: amount,
            comment,
            'cashbox': _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
            'expanse_category': expenseId,
            'custom_rate': customRate,
            staffs
        }
}
const HUNDRED = 100
export const createSendSerializer = (data, cashboxId, withPersent) => {
    const amountFrom = _.toNumber(numberWithoutSpaces(_.get(data, 'amountFrom')))
    const amountTo = _.toNumber(numberWithoutSpaces(_.get(data, 'amountTo')))
    const amountFromPersent = _.toNumber(numberWithoutSpaces(_.get(data, 'amountFromPersent')))
    const amountToPersent = _.toNumber(numberWithoutSpaces(_.get(data, 'amountToPersent')))
    const toCashbox = _.get(data, ['categoryId', 'value'])
    const comment = _.get(data, 'comment')
    const cashbox = _.get(data, ['cashbox', 'value'])
    return {
        amountFrom: withPersent ? amountFromPersent : amountFrom,
        amountTo: withPersent ? amountFromPersent * amountToPersent / HUNDRED : amountTo,
        from_cashbox: _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
        to_cashbox: _.toInteger(toCashbox),
        comment
    }
}

export const convertSerializer = (date, currency) => {
    const toCurrency = _.toInteger(getConfig('PRIMARY_CURRENCY_ID'))
    return {
        'from_currency': toCurrency,
        'to_currency': currency,
        'amount': '1',
        'date': moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
}

export const listFilterSerializer = (data, cashbox) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')
    const newCashbox = (cashbox && cashbox > ZERO) ? cashbox : null
    const type = _.get(defaultData, 'type')
    const withDeleted = toBoolean(_.get(defaultData, 'with_deleted'))
    return {
        'division': _.get(defaultData, 'division'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'type': type,
        'cashbox': newCashbox,
        'with_deleted': withDeleted ? '1' : null,
        'own': 'True',
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'expanse_category': _.get(data, 'categoryExpense')
    }
}
