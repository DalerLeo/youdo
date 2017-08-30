import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

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
        'name': _.get(defaultData, 'name'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'created_date_0': _.get(defaultData, 'fromDate'),
        'created_date_1': _.get(defaultData, 'toDate'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}
export const orderListFilterSerializer = (id) => {
    if (id === true) return {'dept': true}
    return {'client': id}
}

