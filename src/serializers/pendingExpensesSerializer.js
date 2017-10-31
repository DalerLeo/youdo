import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const ZERO = 0
const MINUS_ONE = -1
export const createSerializer = (data, detail) => {
    const expenseId = _.get(detail, 'id')
    const cashboxId = _.get(data, ['cashbox', 'value'])
    const categoryId = _.get(data, ['categoryId', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const amount = _.toNumber(_.get(data, 'amount')) < ZERO ? _.toNumber(_.get(detail, 'amount')) * MINUS_ONE : _.toNumber(_.get(detail, 'amount'))
    return {
        'cashbox': cashboxId,
        'expanse': expenseId,
        'expanse_category': categoryId,
        amount,
        paymentType
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'type': _.get(defaultData, 'type'),
        'paymentType': _.get(defaultData, 'paymentType'),
        'provider': _.get(defaultData, 'provider'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

