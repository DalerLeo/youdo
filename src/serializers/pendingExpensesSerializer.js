import _ from 'lodash'
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
            'expanse_category': categoryId,
            comment,
            amount,
            paymentType
        }
    }

    return {
        'cashbox': cashboxId,
        'supply_expanse': expenseId,
        'expanse_category': categoryId,
        comment,
        amount,
        paymentType
    }
}

export const createExpenseSerializer = (data) => {
    const amount = _.toNumber(numberWithoutSpaces(_.get(data, 'amount'))) * MINUS_ONE
    const comment = _.get(data, 'comment')
    const cashbox = _.get(data, ['cashbox', 'value'])
    const division = _.get(data, ['division', 'value'])
    const supply = _.get(data, ['supply', 'value']) || null
    const supplyExpense = _.get(data, ['supplyExpense', 'value']) || null
    const expenseCategory = _.get(data, ['expanseCategory', 'value', 'id'])
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
        amount,
        cashbox,
        division,
        comment,
        supply,
        supply_expanse: supplyExpense,
        expanse_category: expenseCategory,
        rate_type: getRateType()
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
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

