import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])
    const stockType = _.get(data, ['stockType', 'value'])
    return {
        name,
        'stock_type': stockType
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'id': _.get(defaultData, 'id'),
        'name': _.get(defaultData, 'name'),
        'stockType': _.get(defaultData, 'stock_type'),
        'data_created': _.get(defaultData, 'dataCreated'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

