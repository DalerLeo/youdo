import _ from 'lodash'
import moment from 'moment'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const MINUS_ONE = -1
export const createSerializer = (data, detail) => {
    const expenseId = _.get(detail, 'id')
    const type = _.get(detail, 'type')
    const cashboxId = _.get(data, ['cashbox', 'value'])
    const categoryId = _.get(data, ['categoryId', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const comment = _.get(data, 'comment')
    const amount = _.get(data, 'amount')
        ? _.toNumber(numberWithoutSpaces(_.get(data, 'amount'))) * MINUS_ONE
        : null
    if (type === 'supply') {
        return {
            'cashbox': cashboxId,
            'supply': expenseId,
            'expense_category': categoryId,
            comment,
            amount,
            paymentType
        }
    }

    return {
        'cashbox': cashboxId,
        'supply_expense': expenseId,
        'expense_category': categoryId,
        comment,
        amount,
        paymentType
    }
}

export const createExpenseSerializer = (data) => {
    const date = moment(_.get(data, 'date')).format('YYYY-MM-DD HH:mm:00')
    const amount = _.toNumber(numberWithoutSpaces(_.get(data, 'amount'))) * MINUS_ONE
    const comment = _.get(data, 'comment')
    const cashbox = _.get(data, ['cashbox', 'value'])
    const division = _.get(data, ['division', 'value'])
    const supply = _.get(data, ['supply', 'value']) || null
    const supplyExpense = _.get(data, ['supplyExpense', 'value']) || null
    const expenseCategory = _.get(data, ['expenseCategory', 'value', 'id'])
    const currencyRate = _.get(data, 'currencyRate')
    const getRateType = () => {
        switch (currencyRate) {
            case 'current': return '0'
            case 'order': return '1'
            case 'custom': return '2'
            default: return '0'
        }
    }
    return {
        date,
        amount,
        cashbox,
        division,
        comment,
        supply,
        supply_expense: supplyExpense,
        expense_category: expenseCategory,
        rate_type: getRateType()
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'begin_date': _.get(defaultData, 'fromDate'),
        'end_date': _.get(defaultData, 'toDate'),
        'type': _.get(defaultData, 'type'),
        'paymentType': _.get(defaultData, 'paymentType') || null,
        'provider': _.get(defaultData, 'provider') || null,
        'supply': _.get(defaultData, 'supply') || null,
        'division': _.get(defaultData, 'division') || null,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

