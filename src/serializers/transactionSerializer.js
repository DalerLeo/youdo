import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

const ZERO = 0
const MINUS_ONE = -1

export const createIncomeSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')

    return {
        amount,
        comment,
        'cashbox': cashboxId
    }
}

export const createExpenseSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') > ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const objectId = _.get(data, ['categoryId', 'value'])
    return {
        amount,
        comment,
        'cashbox': cashboxId,
        'expanse_category': objectId
    }
}

export const createSendSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const toCashbox = _.get(data, ['categoryId', 'value'])
    const comment = _.get(data, 'comment')
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

    return (cashbox && cashbox > ZERO) ? {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'type': _.get(defaultData, 'type'),
        'cashbox': cashbox,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    } : {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'type': _.get(defaultData, 'type'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
