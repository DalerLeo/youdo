import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

const ZERO = 0
const MINUS_ONE = -1

export const createIncomeSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') < ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const objectId = _.get(data, ['categoryId', 'value'])

    return {
        amount,
        comment,
        'cashbox': cashboxId,
        'object_id': objectId
    }
}

export const createSendSerializer = (data, cashboxId) => {
    const amount = _.get(data, 'amount') > ZERO ? _.get(data, 'amount') * MINUS_ONE : _.get(data, 'amount')
    const comment = _.get(data, 'comment')
    const objectId = _.get(data, ['categoryId', 'value'])
    return {
        amount,
        comment,
        'cashbox': cashboxId,
        'object_id': objectId
    }
}

export const listFilterSerializer = (data, cashbox) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'type': _.get(defaultData, 'type'),
        'cashbox': cashbox,
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
