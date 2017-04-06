import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const client = _.get(data, ['client', 'id'])
    const amount = parseFloat(_.get(data, 'amount'))

    return {
        client,
        amount
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': orderingSnakeCase(_.get(data, 'ordering'))
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData,
        format: 'csv'
    }
}
