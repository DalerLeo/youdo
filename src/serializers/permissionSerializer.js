import _ from 'lodash'
import {orderingSnakeCase} from '../helpers/serializer'

export const updateSerializer = (id, status) => {
    const statusChange = status === true ? '2' : '1'
    return {
        id,
        'status': statusChange
    }
}

export const listFilterSerializer = (data) => {
    const {...defaultData} = data
    const ordering = _.get(data, 'ordering')

    return {
        'name': _.get(defaultData, 'name'),
        'type': _.get(defaultData, 'type'),
        'search': _.get(defaultData, 'search'),
        'page': _.get(defaultData, 'page'),
        'page_size': _.get(defaultData, 'pageSize'),
        'ordering': ordering && orderingSnakeCase(ordering)
    }
}

