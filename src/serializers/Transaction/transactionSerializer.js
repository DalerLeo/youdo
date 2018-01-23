import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import getConfig from '../../helpers/getConfig'
import toBoolean from '../../helpers/toBoolean'
import moment from 'moment'

const ZERO = 0
const MINUS_ONE = -1

const getRateType = (rateType) => {
    switch (rateType) {
        case 'current': return '0'
        case 'order': return '1'
        case 'custom': return '2'
        default: return '0'
    }
}

export const updateTransactionSerializer = (data, client) => {
    const amount = numberWithoutSpaces(_.get(data, 'amount'))
    const newAmount = amount > ZERO ? amount : amount * MINUS_ONE
    const comment = _.get(data, 'comment')
    const customRate = _.get(data, 'custom_rate')
    const currency = _.get(data, ['currency', 'value'])
    const division = _.get(data, ['division', 'value'])
    const user = _.get(data, ['user', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const currencyRate = _.get(data, ['currencyRate'])
    return {
        'amount': newAmount,
        'comment': comment,
        'custom_rate': customRate,
        client,
        currency,
        division,
        user,
        type: 1,
        payment_type: paymentType,
        rate_type: getRateType(currencyRate)
    }
}

export const createIncomeSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const clientId = _.get(data, ['client', 'value'])
    const provider = _.get(data, ['provider', 'value'])
    const incomeCategory = _.get(data, ['incomeCategory', 'value', 'id'])
    const order = _.get(data, ['order', 'value'])
    const customRate = numberWithoutSpaces(_.get(data, 'custom_rate'))
    const division = _.get(data, ['division', 'value'])
    const cashbox = _.get(data, ['cashbox', 'value'])
    const date = moment(_.get(data, 'date')).format('YYYY-MM-DD HH:00:00')
    const currencyRate = _.get(data, 'currencyRate')
    const staffs = _.filter(_.map(_.get(data, 'users'), (item, index) => {
        return {
            staff: _.toInteger(index),
            amount: _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
        }
    }), (item) => _.toNumber(_.get(item, 'amount')) > ZERO)
    const detalization = _.filter(_.map(_.get(data, 'transaction_child'), (item) => {
        return {
            name: _.get(item, 'name'),
            amount: _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
        }
    }), (item) => _.toNumber(_.get(item, 'amount')) > ZERO && _.get(item, 'name'))
    const salaryAmount = _.sumBy(staffs, (item) => _.get(item, 'amount'))
    return {
        'amount': _.isEmpty(staffs)
            ? numberWithoutSpaces(amount)
            : salaryAmount,
        comment,
        'cashbox': _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
        'custom_rate': customRate,
        'client': clientId,
        'division': division,
        'date': date,
        provider,
        'income_category': incomeCategory,
        order,
        'rate_type': getRateType(currencyRate),
        'transaction_child': detalization
    }
}

export const createExpenseSerializer = (data, cashboxId) => {
    const staffs = _.filter(_.map(_.get(data, 'users'), (item, index) => {
        return {
            staff: _.toInteger(index),
            amount: _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
        }
    }), (item) => {
        return _.toNumber(_.get(item, 'amount')) > ZERO
    })
    const detalization = _.filter(_.map(_.get(data, 'transaction_child'), (item) => {
        return {
            name: _.get(item, 'name'),
            amount: _.toNumber(numberWithoutSpaces(_.get(item, 'amount')))
        }
    }), (item) => _.toNumber(_.get(item, 'amount')) > ZERO && _.get(item, 'name'))
    const amount = Math.abs(numberWithoutSpaces(_.get(data, 'amount'))) * MINUS_ONE
    const salaryAmount = _.sumBy(staffs, item => _.get(item, 'amount') * MINUS_ONE)
    const comment = _.get(data, 'comment')
    const expenseId = _.get(data, ['expanseCategory', 'value', 'id'])
    const clientId = _.get(data, ['client', 'value'])
    const providerId = _.get(data, ['provider', 'value'])
    const supplyExpense = _.get(data, ['supplyExpense', 'value'])
    const customRate = numberWithoutSpaces(_.get(data, 'custom_rate'))
    const division = _.get(data, ['division', 'value'])
    const cashbox = _.get(data, ['cashbox', 'value'])
    const supply = _.get(data, ['supply', 'value'])
    const date = moment(_.get(data, 'date')).format('YYYY-MM-DD HH:00:00')
    const currencyRate = _.get(data, 'currencyRate')

    const request = {
        'amount': _.isEmpty(staffs)
            ? numberWithoutSpaces(amount)
            : salaryAmount,
        comment,
        'cashbox': _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
        'expanse_category': expenseId,
        'supply_expanse': supplyExpense,
        'custom_rate': customRate,
        staffs,
        supply,
        'division': division,
        'rate_type': getRateType(currencyRate),
        'transaction_child': detalization
    }
    return (clientId)
        ? _.merge(request, {'client': clientId, 'date': date})
        : (providerId)
            ? _.merge(request, {'provider': providerId, 'date': date})
            : request
}
const HUNDRED = 100
export const createSendSerializer = (data, cashboxId, withPersent) => {
    const amountFrom = _.toNumber(numberWithoutSpaces(_.get(data, 'amountFrom')))
    const amountTo = _.toNumber(numberWithoutSpaces(_.get(data, 'amountTo')))
    const amountFromPersent = _.toNumber(numberWithoutSpaces(_.get(data, 'amountFromPersent')))
    const amountToPersent = _.toNumber(numberWithoutSpaces(_.get(data, 'amountToPersent')))
    const toCashbox = _.get(data, ['categoryId', 'value'])
    const comment = _.get(data, 'comment')
    const cashbox = _.get(data, ['cashbox', 'value', 'id'])
    return {
        amount_from: withPersent ? amountFromPersent : amountFrom,
        amount_to: withPersent ? amountFromPersent * amountToPersent / HUNDRED : amountTo,
        from_cashbox: _.toInteger(cashboxId) === ZERO ? cashbox : cashboxId,
        to_cashbox: _.toInteger(toCashbox),
        comment
    }
}

export const convertSerializer = (date, currency, order) => {
    const fromCurrency = _.toInteger(getConfig('PRIMARY_CURRENCY_ID'))
    return {
        'from_currency': fromCurrency,
        'to_currency': currency,
        'order': order,
        'amount': '1',
//        'date': moment(date).format('YYYY-MM-DD HH:mm:ss')
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
        'client': _.get(data, 'client'),
        'staff': _.get(data, 'staff'),
        'with_deleted': withDeleted ? '1' : null,
        'own': 'True',
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'expanse_category': _.get(data, 'categoryExpense')
    }
}
