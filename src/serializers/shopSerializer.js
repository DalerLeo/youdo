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
        ...defaultData,
        'ordering': orderingSnakeCase(_.get(data, 'ordering'))
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = data

    return {
        ...defaultData,
        format: 'csv'
    }
}
