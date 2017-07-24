import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'
import numberWithoutSpaces from '../helpers/numberWithoutSpaces'

export const createSerializer = (data, order) => {
    const amount = _.get(data, 'amount')
    const cashbox = _.get(data, ['cashbox', 'value', 'id'])
    const now = _.get(data, 'now') || true
    return {
        order,
        'amount': numberWithoutSpaces(amount),
        cashbox,
        now
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'debt': true,
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'market': _.get(defaultData, 'market'),
        'client': _.get(defaultData, 'client'),
        'payment_type': _.get(defaultData, 'paymentType')
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
