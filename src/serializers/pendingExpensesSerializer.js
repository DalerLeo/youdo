import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const MINUS_ONE = -1
const ZERO = 0
export const createSerializer = (data, detail) => {
    const expenseId = _.get(detail, 'id')
    const type = _.get(detail, 'type')
    const cashboxId = _.get(data, ['cashbox', 'value'])
    const categoryId = _.get(data, ['categoryId', 'value'])
    const paymentType = _.get(data, ['paymentType', 'value'])
    const comment = _.get(data, 'comment')
    const amount = _.toNumber(_.get(data, 'amount')) > ZERO ? _.toNumber(_.get(data, 'amount')) * MINUS_ONE : _.toNumber(_.get(data, 'amount'))
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

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'type': _.get(defaultData, 'type'),
        'paymentType': _.get(defaultData, 'paymentType'),
        'provider': _.get(defaultData, 'provider'),
        'supply': _.get(defaultData, 'supply'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

