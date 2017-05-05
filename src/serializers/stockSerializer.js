import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const manager = _.get(data, ['manager', 'value'])
    const stockType = _.get(data, ['stockType', 'value'])
    return {
        name,
        manager,
        'stock_type': stockType
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'id': _.get(defaultData, 'id'),
        'name': _.get(defaultData, 'name'),
        'stock_type': _.get(defaultData, 'stock_type'),
        'manager': _.get(defaultData, 'manager'),
        'data_created': _.get(defaultData, 'dataCreated'),
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
