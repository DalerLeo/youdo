import _ from 'lodash'
import {orderingSnakeCase} from '../../helpers/serializer'

export const createSerializer = (data) => {
    const name = _.get(data, ['name'])

    return {
        name
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate')
    }
}

export const itemSerializer = (data, id) => {
    const {...defaultData} = data

    return {
        'market': id,
        'page': _.get(defaultData, 'dPage'),
        'page_size': _.get(defaultData, 'dPageSize'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate')
    }
}

export const csvFilterSerializer = (data) => {
    const {...defaultData} = listFilterSerializer(data)

    return {
        ...defaultData
    }
}
